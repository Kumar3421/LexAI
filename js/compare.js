/**
 * LexAI — Contract Comparator Feature
 */

import { generate } from "./gemini.js";
import { setupUploadZone, truncateText } from "./document.js";
import { showToast, renderMarkdown, showSkeleton, showError } from "./ui.js";
import { SAMPLES } from "./samples.js";

let textA = "";
let textB = "";

export function initCompare() {
  const zoneA   = document.getElementById("compare-upload-a");
  const fileA   = document.getElementById("compare-file-a");
  const inputA  = document.getElementById("compare-text-a");
  const zoneB   = document.getElementById("compare-upload-b");
  const fileB   = document.getElementById("compare-file-b");
  const inputB  = document.getElementById("compare-text-b");
  const runBtn  = document.getElementById("compare-run-btn");
  const output  = document.getElementById("compare-output");
  const sampleBtn = document.getElementById("compare-sample-btn");

  setupUploadZone(zoneA, fileA, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    textA = text;
    inputA.value = "";
    showToast(`✓ Document A loaded`, "success");
  });

  setupUploadZone(zoneB, fileB, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    textB = text;
    inputB.value = "";
    showToast(`✓ Document B loaded`, "success");
  });

  // Quick compare sample buttons
  sampleBtn?.addEventListener("click", () => {
    inputA.value = SAMPLES.nda.text;
    textA = "";
    inputB.value = SAMPLES.ndaStrict.text;
    textB = "";
    showToast("✓ Loaded Standard Mutual NDA (Doc A) vs. Strict Heavy NDA (Doc B)", "success");
  });

  document.getElementById("compare-sample-lease")?.addEventListener("click", () => {
    inputA.value = SAMPLES.leaseTenantFriendly.text;
    textA = "";
    inputB.value = SAMPLES.lease.text;
    textB = "";
    showToast("✓ Loaded Tenant-Friendly Lease (Doc A) vs. Strict Landlord Lease (Doc B)", "success");
  });

  document.getElementById("compare-sample-contractor")?.addEventListener("click", () => {
    inputA.value = SAMPLES.consultingFair.text;
    textA = "";
    inputB.value = SAMPLES.consulting.text;
    textB = "";
    showToast("✓ Loaded Balanced Contractor (Doc A) vs. High-Risk Contractor (Doc B)", "success");
  });

  runBtn.addEventListener("click", async () => {
    const docA = textA || inputA.value.trim();
    const docB = textB || inputB.value.trim();

    if (!docA || !docB) {
      showToast("Please provide both Document A and Document B.", "error");
      return;
    }

    showSkeleton(output, "Comparing documents...");
    runBtn.disabled = true;
    runBtn.innerHTML = `<div class="spinner"></div> Comparing...`;

    try {
      const prompt = buildComparePrompt(docA, docB);
      const result = await generate(prompt, { temperature: 0.4 });
      renderCompareOutput(output, result);
    } catch (err) {
      showError(output, err.message);
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = `<i data-lucide="git-compare"></i> Compare Documents`;
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function buildComparePrompt(docA, docB) {
  return `You are an expert legal document analyst. Compare the two legal documents below.

Return your analysis as a JSON object with this exact structure:
{
  "summary": "2-3 sentence overview of the key differences",
  "riskScoreA": <number 1-10>,
  "riskScoreB": <number 1-10>,
  "riskSummaryA": "brief risk explanation for Document A",
  "riskSummaryB": "brief risk explanation for Document B",
  "differences": [
    {
      "type": "added|removed|modified|risk",
      "category": "e.g. Payment Terms, Termination, Liability, etc.",
      "description": "clear explanation of the difference",
      "docA": "what Document A says (or null if not present)",
      "docB": "what Document B says (or null if not present)",
      "significance": "low|medium|high"
    }
  ],
  "commonClauses": ["list of important clauses that appear in both"],
  "recommendation": "overall recommendation about which document is more favorable and why"
}

DOCUMENT A:
---
${truncateText(docA, 70000)}
---

DOCUMENT B:
---
${truncateText(docB, 70000)}
---

Return ONLY valid JSON, no markdown fences.`;
}

function renderCompareOutput(output, rawResult) {
  let data;
  try {
    const clean = rawResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    data = JSON.parse(clean);
  } catch {
    // Fallback: render as markdown
    output.innerHTML = `<div class="output-section"><div class="output-card"><div class="prose">${renderMarkdown(rawResult)}</div></div></div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const highCount = (data.differences || []).filter(d => d.significance === "high").length;
  const tagMap    = { added: "added", removed: "removed", modified: "modified", risk: "removed" };

  output.innerHTML = `
    <div class="output-section">
      <div class="disclaimer-banner">
        <i data-lucide="info"></i>
        <span>This comparison is for informational purposes only and does not constitute legal advice.</span>
      </div>

      <!-- Summary card -->
      <div class="output-card">
        <div class="output-title"><i data-lucide="git-compare"></i> Comparison Summary</div>
        <p class="prose">${data.summary}</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;">
          ${["A","B"].map(letter => {
            const score = data[`riskScore${letter}`];
            const summary = data[`riskSummary${letter}`];
            const color = score >= 7 ? "var(--risk-high)" : score >= 4 ? "var(--risk-med)" : "var(--risk-low)";
            return `
              <div class="output-card" style="margin:0; border-left: 3px solid ${color};">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px;">Document ${letter}</div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                  <span style="font-size:1.8rem; font-weight:900; color:${color};">${score}<span style="font-size:0.9rem; color:var(--text-muted)">/10</span></span>
                  <span style="font-size:0.78rem; color:var(--text-muted);">Risk Score</span>
                </div>
                <p style="font-size:0.78rem; color:var(--text-secondary);">${summary}</p>
              </div>`;
          }).join("")}
        </div>

        ${highCount > 0 ? `<div style="margin-top:12px; padding:10px 14px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:8px; font-size:0.8rem; color:#ef4444;">⚠️ ${highCount} high-significance difference${highCount>1?"s":""} found. Review carefully before signing.</div>` : ""}
      </div>

      <!-- Differences -->
      <div class="output-title" style="margin-top:8px; display:flex; align-items:center; justify-content:space-between;">
        <span><i data-lucide="list-minus"></i> Key Differences (${(data.differences||[]).length})</span>
        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Click any difference to view snippets</span>
      </div>
      ${(data.differences || []).map((d, idx) => `
        <div class="diff-item ${tagMap[d.type] || ""} ${idx === 0 || d.significance === 'high' ? 'expanded' : ''}" onclick="this.classList.toggle('expanded')">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
            <span class="diff-tag ${tagMap[d.type] || "neutral"}">${d.type}</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">${d.category}</span>
            <span style="margin-left:auto; display:flex; align-items:center; gap:6px;">
              <span class="diff-tag ${d.significance === "high" ? "removed" : d.significance === "medium" ? "modified" : "neutral"}">${d.significance} impact</span>
              <i data-lucide="chevron-down" class="diff-chevron"></i>
            </span>
          </div>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:6px;">${d.description}</p>
          ${d.docA || d.docB ? `
          <div class="diff-details">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px;">
              <div style="padding:8px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid var(--border);">
                <div style="font-size:0.65rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Doc A (Baseline)</div>
                <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.5;">${d.docA || "—"}</div>
              </div>
              <div style="padding:8px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid var(--border);">
                <div style="font-size:0.65rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Doc B (Comparison)</div>
                <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.5;">${d.docB || "—"}</div>
              </div>
            </div>
          </div>` : ""}
        </div>`).join("")}

      <!-- Common Clauses -->
      ${data.commonClauses?.length ? `
        <div class="output-card" style="margin-top:8px;">
          <div class="output-title"><i data-lucide="check-circle-2"></i> Shared Clauses</div>
          <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:2;">
            ${data.commonClauses.map(c => `<li>${c}</li>`).join("")}
          </ul>
        </div>` : ""}

      <!-- Recommendation -->
      ${data.recommendation ? `
        <div class="output-card" style="border-color:rgba(99,102,241,0.3); background:var(--primary-dim);">
          <div class="output-title"><i data-lucide="lightbulb"></i> Recommendation</div>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.7;">${data.recommendation}</p>
        </div>` : ""}

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-2" style="flex-wrap:wrap;">
        <button class="copy-btn" id="compare-copy-btn"><i data-lucide="copy"></i> Copy Analysis</button>
        <button class="copy-btn" id="compare-download-btn"><i data-lucide="download"></i> Download Report</button>
        <button class="copy-btn" id="compare-print-btn"><i data-lucide="printer"></i> Print / PDF</button>
      </div>
    </div>`;

  if (window.lucide) window.lucide.createIcons();

  // Copy functionality
  document.getElementById("compare-copy-btn")?.addEventListener("click", () => {
    const text = `LEXAI CONTRACT COMPARISON REPORT\n\nSummary:\n${data.summary}\n\nRisk Scores:\nDocument A: ${data.riskScoreA}/10 - ${data.riskSummaryA}\nDocument B: ${data.riskScoreB}/10 - ${data.riskSummaryB}\n\nDifferences:\n` +
      (data.differences || []).map(d => `* [${d.category}] (${d.type.toUpperCase()}, ${d.significance} impact): ${d.description}\n  Doc A: ${d.docA || "N/A"}\n  Doc B: ${d.docB || "N/A"}`).join("\n\n") +
      `\n\nRecommendation:\n${data.recommendation || ""}`;
    navigator.clipboard.writeText(text);
    showToast("Comparison report copied!", "success");
  });

  // Download functionality
  document.getElementById("compare-download-btn")?.addEventListener("click", () => {
    const text = `# LexAI Contract Comparison Report\n\n**Summary:** ${data.summary}\n\n## Risk Scores\n- **Document A:** ${data.riskScoreA}/10 — ${data.riskSummaryA}\n- **Document B:** ${data.riskScoreB}/10 — ${data.riskSummaryB}\n\n## Key Differences\n` +
      (data.differences || []).map(d => `### ${d.category} (${d.type.toUpperCase()})\n- **Significance:** ${d.significance}\n- **Description:** ${d.description}\n- **Document A:** ${d.docA || "None"}\n- **Document B:** ${d.docB || "None"}`).join("\n\n") +
      `\n\n## Recommendation\n${data.recommendation || ""}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LexAI_Contract_Comparison.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded comparison report!", "success");
  });

  // Print
  document.getElementById("compare-print-btn")?.addEventListener("click", () => {
    window.print();
  });
}
