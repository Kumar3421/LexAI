/**
 * LexAI — Action Checklist Generator Feature
 */

import { generate } from "./gemini.js";
import { setupUploadZone, truncateText } from "./document.js";
import { showToast, showSkeleton, showError } from "./ui.js";

let uploadedText = "";

export function initChecklist() {
  const zone       = document.getElementById("checklist-upload-zone");
  const fileIn     = document.getElementById("checklist-file-input");
  const situation  = document.getElementById("checklist-situation");
  const runBtn     = document.getElementById("checklist-run-btn");
  const output     = document.getElementById("checklist-output");
  const sampleBtn1 = document.getElementById("checklist-sample-btn");
  const sampleBtn2 = document.getElementById("checklist-sample-lease");

  setupUploadZone(zone, fileIn, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    uploadedText = text;
    showToast(`✓ ${file.name} loaded`, "success");
  });

  // Sample scenarios
  sampleBtn1?.addEventListener("click", () => {
    situation.value = "My former landlord is withholding my entire $4,500 security deposit after I moved out 40 days ago. They claim $2,500 for carpet replacement and painting, but I have move-in/move-out photos showing the property was clean and only had normal wear and tear. They refuse to provide receipts.";
    uploadedText = "";
    showToast("✓ Loaded Security Deposit Dispute scenario", "success");
  });

  sampleBtn2?.addEventListener("click", () => {
    situation.value = "I am reviewing a 12-month apartment lease for a new rental in Springfield ($2,250/mo). The landlord included clauses for automatic 1-year renewal at 10% rent hike, 2-hour entry notice, tenant paying all repairs under $200, and $4,500 early termination penalty. What specific steps should I take before signing?";
    uploadedText = "";
    showToast("✓ Loaded Lease Signing Review scenario", "success");
  });

  document.getElementById("checklist-sample-contractor")?.addEventListener("click", () => {
    situation.value = "I am an independent software consultant and a client is 60 days overdue on a $14,200 invoice. The client is still using the web app in live production. They claim a pay-when-paid clause applies. I need an immediate step-by-step enforcement and demand checklist before filing in court.";
    uploadedText = "";
    showToast("✓ Loaded Unpaid Freelance Invoices scenario", "success");
  });

  runBtn.addEventListener("click", async () => {
    const situationText = situation.value.trim();
    const docText = uploadedText || "";

    if (!situationText && !docText) {
      showToast("Please describe your situation or upload a document.", "error");
      return;
    }

    showSkeleton(output, "Generating your checklist...");
    runBtn.disabled = true;
    runBtn.innerHTML = `<div class="spinner"></div> Generating...`;

    try {
      const prompt = buildChecklistPrompt(situationText, docText);
      const result = await generate(prompt, { temperature: 0.5 });
      renderChecklistOutput(output, result);
    } catch (err) {
      showError(output, err.message);
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = `<i data-lucide="list-checks"></i> Generate Checklist`;
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function buildChecklistPrompt(situation, docText) {
  return `You are an expert legal advisor helping someone navigate their legal situation. Generate a practical, prioritized action checklist.

Return ONLY a valid JSON object (no markdown) with this structure:
{
  "situationSummary": "1-2 sentence summary of the situation",
  "urgencyLevel": "immediate|soon|not-urgent",
  "urgencyNote": "brief note about urgency",
  "groups": [
    {
      "groupTitle": "e.g. Do Immediately, Gather Documents, Before Signing, Consult a Professional",
      "icon": "lucide icon name (e.g. zap, folder, pen-line, user)",
      "items": [
        {
          "action": "clear, specific action to take",
          "why": "brief reason why this step matters",
          "priority": "urgent|soon|normal"
        }
      ]
    }
  ],
  "importantWarnings": ["any important warnings or things NOT to do"],
  "professionalAdvice": "specific guidance on what type of lawyer to see and when"
}

${situation ? `USER'S SITUATION:\n${situation}\n` : ""}
${docText ? `UPLOADED DOCUMENT:\n---\n${truncateText(docText, 60000)}\n---` : ""}

Make the checklist practical, specific, and actionable. Avoid generic advice. Include 3-6 groups with 2-5 items each.`;
}

function renderChecklistOutput(output, rawResult) {
  let data;
  try {
    const clean = rawResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    data = JSON.parse(clean);
  } catch {
    output.innerHTML = `<div class="output-section"><div class="output-card"><p class="prose">${rawResult}</p></div></div>`;
    return;
  }

  const urgencyColor = data.urgencyLevel === "immediate" ? "var(--risk-high)" : data.urgencyLevel === "soon" ? "var(--risk-med)" : "var(--risk-low)";
  const groups = data.groups || data.checklistGroups || [];
  const totalItems = groups.reduce((a, g) => a + (g.items ? g.items.length : 0), 0);

  output.innerHTML = `
    <div class="output-section">
      <div class="disclaimer-banner">
        <i data-lucide="info"></i>
        <span>This checklist is for informational purposes only. Always consult a qualified legal professional for your specific situation.</span>
      </div>

      <!-- Summary -->
      <div class="output-card" style="border-left:4px solid ${urgencyColor}; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
          <span style="font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:99px; background:rgba(0,0,0,0.2); color:${urgencyColor}; text-transform:uppercase; letter-spacing:.06em;">${data.urgencyLevel || "normal"}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${totalItems} action items across ${groups.length} categories</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:6px;">${data.situationSummary}</p>
        ${data.urgencyNote || data.deadlineWarning ? `<p style="font-size:0.8rem; color:${urgencyColor}; font-weight:600;">⏰ ${data.urgencyNote || data.deadlineWarning}</p>` : ""}
      </div>

      <!-- Live Interactive Progress Tracker -->
      <div class="checklist-progress-card">
        <div class="checklist-progress-header">
          <span><i data-lucide="check-square" style="width:14px; height:14px; vertical-align:middle; margin-right:4px;"></i> Completion Progress</span>
          <span id="checklist-progress-text">0 of ${totalItems} completed (0%)</span>
        </div>
        <div class="checklist-progress-bar-wrap">
          <div class="checklist-progress-fill" id="checklist-progress-fill" style="width:0%;"></div>
        </div>
      </div>

      <!-- Checklist groups -->
      ${groups.map(group => `
        <div class="checklist-group">
          <div class="checklist-group-title">
            <i data-lucide="${group.icon || 'list'}"></i>
            ${group.groupTitle}
          </div>
          ${(group.items || []).map((item, idx) => `
            <div class="checklist-item" id="check-${(group.groupTitle||'').replace(/[^a-zA-Z0-9]/g,'')}-${idx}">
              <div class="checklist-check"></div>
              <div class="checklist-content">
                <div class="checklist-action">${item.action}</div>
                <div class="checklist-why">${item.why}</div>
              </div>
              <div class="checklist-priority ${item.priority}">${item.priority}</div>
            </div>`).join("")}
        </div>`).join("")}

      <!-- Warnings -->
      ${data.importantWarnings?.length ? `
        <div class="output-card" style="border-left:4px solid var(--risk-high); background:rgba(239,68,68,0.05);">
          <div class="output-title" style="color:var(--risk-high);"><i data-lucide="alert-triangle"></i> Important Warnings</div>
          <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:2;">
            ${data.importantWarnings.map(w => `<li>${w}</li>`).join("")}
          </ul>
        </div>` : ""}

      <!-- Professional advice -->
      ${data.professionalAdvice ? `
        <div class="output-card" style="border-left:4px solid var(--primary); background:var(--primary-dim);">
          <div class="output-title"><i data-lucide="user-check"></i> When to See a Lawyer</div>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.7;">${data.professionalAdvice}</p>
        </div>` : ""}

      <!-- Action buttons -->
      <div class="flex gap-2 mt-2" style="flex-wrap:wrap;">
        <button class="copy-btn" id="checklist-copy-btn"><i data-lucide="copy"></i> Copy Checklist</button>
        <button class="copy-btn" id="checklist-download-btn"><i data-lucide="download"></i> Download Checklist</button>
        <button class="copy-btn" id="checklist-print-btn"><i data-lucide="printer"></i> Print / PDF</button>
      </div>
    </div>`;

  if (window.lucide) window.lucide.createIcons();

  // Wire interactive item toggling & live progress bar
  const items = output.querySelectorAll(".checklist-item");
  const progressText = document.getElementById("checklist-progress-text");
  const progressFill = document.getElementById("checklist-progress-fill");

  const updateProgress = () => {
    const doneCount = output.querySelectorAll(".checklist-item.done").length;
    const pct = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;
    if (progressText) progressText.textContent = `${doneCount} of ${totalItems} completed (${pct}%)`;
    if (progressFill) progressFill.style.width = `${pct}%`;
  };

  items.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("done");
      updateProgress();
    });
  });

  // Copy functionality
  document.getElementById("checklist-copy-btn")?.addEventListener("click", () => {
    const text = `LEXAI ACTION CHECKLIST\n\nSituation: ${data.situationSummary}\nUrgency: ${(data.urgencyLevel||'').toUpperCase()}\n\n` +
      groups.map(g =>
        `## ${g.groupTitle}\n` + (g.items || []).map(i => `☐ [${i.priority.toUpperCase()}] ${i.action}\n  Reason: ${i.why}`).join("\n")
      ).join("\n\n") +
      (data.importantWarnings?.length ? `\n\nWarnings:\n${data.importantWarnings.map(w => `! ${w}`).join("\n")}` : "") +
      (data.professionalAdvice ? `\n\nLegal Counsel Advice:\n${data.professionalAdvice}` : "");

    navigator.clipboard.writeText(text);
    showToast("Checklist copied!", "success");
  });

  // Download functionality
  document.getElementById("checklist-download-btn")?.addEventListener("click", () => {
    const text = `# LexAI Action Checklist\n\n**Situation:** ${data.situationSummary}\n**Urgency:** ${(data.urgencyLevel||'').toUpperCase()}\n\n` +
      groups.map(g =>
        `### ${g.groupTitle}\n` + (g.items || []).map(i => `- [ ] **${i.action}**\n  - *Why:* ${i.why} (Priority: ${i.priority})`).join("\n")
      ).join("\n\n") +
      (data.importantWarnings?.length ? `\n\n### Important Warnings\n${data.importantWarnings.map(w => `- ⚠️ ${w}`).join("\n")}` : "") +
      (data.professionalAdvice ? `\n\n### Professional Guidance\n${data.professionalAdvice}` : "");

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LexAI_Action_Checklist.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded checklist!", "success");
  });

  // Print
  document.getElementById("checklist-print-btn")?.addEventListener("click", () => {
    window.print();
  });
}
