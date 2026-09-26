/**
 * LexAI — Document Simplifier Feature
 */

import { generateStream } from "./gemini.js";
import { setupUploadZone, truncateText } from "./document.js";
import { showToast, renderMarkdown, showSkeleton, showError } from "./ui.js";
import { SAMPLES } from "./samples.js";

let uploadedText = "";

export function initSimplify() {
  const zone    = document.getElementById("simplify-upload-zone");
  const fileIn  = document.getElementById("simplify-file-input");
  const textIn  = document.getElementById("simplify-text-input");
  const runBtn  = document.getElementById("simplify-run-btn");
  const output  = document.getElementById("simplify-output");

  // Upload zone
  setupUploadZone(zone, fileIn, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    uploadedText = text;
    textIn.value = "";
    showToast(`✓ ${file.name} loaded`, "success");
  });

  // Sample document buttons
  document.querySelectorAll("#panel-simplify .sample-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const sampleKey = pill.dataset.sample;
      if (SAMPLES[sampleKey]) {
        textIn.value = SAMPLES[sampleKey].text;
        uploadedText = "";
        showToast(`Loaded sample: ${SAMPLES[sampleKey].title}`, "success");
      }
    });
  });

  // Run button
  runBtn.addEventListener("click", async () => {
    const docText = uploadedText || textIn.value.trim();
    if (!docText) {
      showToast("Please upload a document or paste text first.", "error");
      return;
    }

    const level = document.querySelector("#simplify-level-group .pill.active")?.dataset.value || "general";
    const levelMap = {
      elementary:   "a 5th grader (simple words, very short sentences, no jargon)",
      general:      "a general adult audience (plain English, minimal jargon, clear explanations)",
      professional: "a business professional (semi-technical, concise, preserve important legal terms with brief explanations)",
    };

    const prompt = buildSimplifyPrompt(docText, levelMap[level]);
    await runSimplify(prompt, output, runBtn);
  });
}

function buildSimplifyPrompt(docText, audienceDesc) {
  return `You are an expert legal document simplifier. Your job is to make legal documents understandable.

TASK: Simplify the following legal document for ${audienceDesc}.

INSTRUCTIONS:
1. Start with a "📋 Document Overview" section — 2-3 sentences explaining what this document is and its purpose.
2. Create a "👥 Key Parties" section listing all parties involved.
3. Create a "📌 Plain English Summary" — rewrite the main content in simple, clear language. Preserve all important information but eliminate jargon. Use bullet points where helpful.
4. Create a "⚡ Key Obligations" section — what each party must do.
5. Create a "📅 Important Dates & Deadlines" section (if any).
6. Create a "⚠️ Things to Watch Out For" section — any clauses that seem unusual, restrictive, or important.
7. End with a disclaimer: "ℹ️ This simplification is for informational purposes only and does not constitute legal advice."

Use clear headings, bullet points, and simple language throughout.

DOCUMENT:
---
${truncateText(docText)}
---`;
}

async function runSimplify(prompt, output, runBtn) {
  // Skeleton
  showSkeleton(output, "Simplifying your document...");
  runBtn.disabled = true;
  runBtn.innerHTML = `<div class="spinner"></div> Simplifying...`;

  try {
    output.innerHTML = `
      <div class="output-section">
        <div class="disclaimer-banner">
          <i data-lucide="info"></i>
          <span>This simplification is for informational purposes only and does not constitute legal advice. Always consult a qualified lawyer for legal matters.</span>
        </div>
        <div class="output-card">
          <div class="prose" id="simplify-prose"></div>
        </div>
        <div class="flex gap-2 mt-2" style="flex-wrap:wrap;">
          <button class="copy-btn" id="simplify-copy-btn"><i data-lucide="copy"></i> Copy</button>
          <button class="copy-btn" id="simplify-download-btn"><i data-lucide="download"></i> Download</button>
          <button class="copy-btn" id="simplify-print-btn"><i data-lucide="printer"></i> Print / PDF</button>
        </div>
      </div>`;
    if (window.lucide) window.lucide.createIcons();

    const proseEl = document.getElementById("simplify-prose");
    let fullText = "";

    await generateStream(prompt, (chunk, full) => {
      fullText = full;
      proseEl.innerHTML = renderMarkdown(full);
    });

    // Copy button
    document.getElementById("simplify-copy-btn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(fullText);
      showToast("Copied to clipboard!", "success");
    });

    // Download button
    document.getElementById("simplify-download-btn")?.addEventListener("click", () => {
      const blob = new Blob([fullText], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LexAI_Simplified_Document.md";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Downloaded summary file!", "success");
    });

    // Print button
    document.getElementById("simplify-print-btn")?.addEventListener("click", () => {
      window.print();
    });

  } catch (err) {
    showError(output, err.message);
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = `<i data-lucide="wand-2"></i> Simplify Document`;
    if (window.lucide) window.lucide.createIcons();
  }
}
