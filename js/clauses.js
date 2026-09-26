/**
 * LexAI — Clause Risk Analyzer Feature
 */

import { generate } from "./gemini.js";
import { setupUploadZone, truncateText } from "./document.js";
import { showToast, showSkeleton, showError } from "./ui.js";
import { SAMPLES } from "./samples.js";

let uploadedText = "";

export function initClauses() {
  const zone    = document.getElementById("clauses-upload-zone");
  const fileIn  = document.getElementById("clauses-file-input");
  const textIn  = document.getElementById("clauses-text-input");
  const runBtn  = document.getElementById("clauses-run-btn");
  const output  = document.getElementById("clauses-output");

  setupUploadZone(zone, fileIn, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    uploadedText = text;
    textIn.value = "";
    showToast(`✓ ${file.name} loaded`, "success");
  });

  // Wire sample pills
  document.querySelectorAll("#panel-clauses .sample-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const sampleKey = pill.dataset.sample;
      if (SAMPLES[sampleKey]) {
        textIn.value = SAMPLES[sampleKey].text;
        uploadedText = "";
        showToast(`Loaded sample: ${SAMPLES[sampleKey].title}`, "success");
      }
    });
  });

  runBtn.addEventListener("click", async () => {
    const docText = uploadedText || textIn.value.trim();
    if (!docText) {
      showToast("Please upload a document or paste text first.", "error");
      return;
    }

    showSkeleton(output, "Scanning for risks...");
    runBtn.disabled = true;
    runBtn.innerHTML = `<div class="spinner"></div> Scanning...`;

    try {
      const prompt = buildClausesPrompt(docText);
      const result = await generate(prompt, { temperature: 0.3 });
      renderClausesOutput(output, result);
    } catch (err) {
      showError(output, err.message);
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = `<i data-lucide="scan-search"></i> Scan for Risks`;
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function buildClausesPrompt(docText) {
  return `RISK SCANNER — You are an expert legal risk analyst. Analyze the following legal document, identify and assess risky clauses, and provide risk score and overallRiskSummary.

Return ONLY a valid JSON object with this exact structure (no markdown, no commentary):
{
  "documentType": "e.g. Employment Agreement, NDA, Service Contract, etc.",
  "overallRisk": "low|medium|high",
  "overallRiskSummary": "2-3 sentence summary of overall document risk",
  "clauses": [
    {
      "title": "Clause name/type (e.g. Non-Compete, Limitation of Liability, Auto-Renewal)",
      "riskLevel": "low|medium|high",
      "plainExplanation": "Clear 1-2 sentence explanation of what this clause means in plain English",
      "whyItMatters": "Why the user should care about this clause",
      "redFlags": ["any concerning aspects of this specific clause"],
      "originalText": "short excerpt of the clause from the document"
    }
  ],
  "inconsistencies": ["list of conflicting obligations or contradictory terms, if any"],
  "obligations": [
    { "party": "Party Name", "obligation": "Specific legal duty" }
  ]
}

DOCUMENT:
---
${truncateText(docText, 70000)}
---

Extract at least 4-8 key clauses. Flag every clause that is potentially disadvantageous or unusual. Return ONLY valid JSON.`;
}

function renderClausesOutput(output, rawResult) {
  let data;
  try {
    const clean = rawResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    data = JSON.parse(clean);
  } catch {
    output.innerHTML = `<div class="output-section"><div class="output-card"><p class="prose">${rawResult}</p></div></div>`;
    return;
  }

  const rawClauses = data.clauses || [];
  const clauses = rawClauses.map(c => ({
    title: c.title || "Untitled Clause",
    riskLevel: c.riskLevel || c.risk || "medium",
    plainExplanation: c.plainExplanation || c.plainMeaning || c.analysis || "",
    whyItMatters: c.whyItMatters || c.analysis || c.recommendation || "",
    redFlags: c.redFlags || (c.recommendation ? [c.recommendation] : []),
    originalText: c.originalText || c.quote || ""
  }));

  const high   = clauses.filter(c => c.riskLevel === "high").length;
  const med    = clauses.filter(c => c.riskLevel === "medium").length;
  const low    = clauses.filter(c => c.riskLevel === "low").length;
  const overallRisk = data.overallRisk || data.riskLevel || (high > 1 ? "high" : med > 2 ? "medium" : "low");
  const overallColor = overallRisk === "high" ? "var(--risk-high)" : overallRisk === "medium" ? "var(--risk-med)" : "var(--risk-low)";

  output.innerHTML = `
    <div class="output-section">
      <div class="disclaimer-banner">
        <i data-lucide="info"></i>
        <span>This risk analysis highlights clauses that may require attention. It is not formal legal advice. Always consult a qualified attorney before signing contracts.</span>
      </div>

      <!-- Overall risk card -->
      <div class="output-card" style="border-left: 4px solid ${overallColor};">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <span class="clause-risk-badge ${overallRisk}" style="font-size:0.8rem; padding:4px 12px;">${overallRisk.toUpperCase()} RISK</span>
          <span style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">${data.documentType || "Contract Document"}</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">${data.overallRiskSummary || data.scoreExplanation || ""}</p>
      </div>

      <!-- Risk stats -->
      <div class="risk-stats-bar">
        <div class="risk-stat">
          <div class="risk-stat-dot high"></div>
          <div class="risk-stat-info">
            <span class="risk-stat-count" style="color:var(--risk-high);">${high}</span>
            <span class="risk-stat-label">High Risk</span>
          </div>
        </div>
        <div class="risk-stat">
          <div class="risk-stat-dot med"></div>
          <div class="risk-stat-info">
            <span class="risk-stat-count" style="color:var(--risk-med);">${med}</span>
            <span class="risk-stat-label">Medium</span>
          </div>
        </div>
        <div class="risk-stat">
          <div class="risk-stat-dot low"></div>
          <div class="risk-stat-info">
            <span class="risk-stat-count" style="color:var(--risk-low);">${low}</span>
            <span class="risk-stat-label">Low Risk</span>
          </div>
        </div>
        <div class="risk-stat">
          <div class="risk-stat-dot" style="background:var(--primary);"></div>
          <div class="risk-stat-info">
            <span class="risk-stat-count" style="color:var(--primary-light);">${clauses.length}</span>
            <span class="risk-stat-label">Total Clauses</span>
          </div>
        </div>
      </div>

      <!-- Inconsistencies (if detected) -->
      ${data.inconsistencies?.length ? `
        <div class="output-card" style="border-left:4px solid var(--amber); background:rgba(245,158,11,0.06); margin-bottom:12px;">
          <div class="output-title" style="color:var(--amber);"><i data-lucide="alert-circle"></i> Detected Inconsistencies & Red Flags</div>
          <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:1.8;">
            ${data.inconsistencies.map(inc => `<li>${inc}</li>`).join("")}
          </ul>
        </div>` : ""}

      <!-- Clause cards — sorted by risk (high first) -->
      <div class="output-title" style="display:flex; align-items:center; justify-content:space-between;">
        <span><i data-lucide="shield-alert"></i> Clause Breakdown (${clauses.length})</span>
        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Click any clause to expand/collapse</span>
      </div>
      ${[...clauses].sort((a, b) => {
          const order = { high: 0, medium: 1, low: 2 };
          return (order[a.riskLevel] ?? 1) - (order[b.riskLevel] ?? 1);
        }).map(clause => `
        <div class="clause-card ${clause.riskLevel} ${clause.riskLevel === 'high' ? 'expanded' : ''}" onclick="this.classList.toggle('expanded')">
          <div class="clause-header">
            <div class="clause-header-left">
              <span class="clause-risk-badge ${clause.riskLevel}">${clause.riskLevel}</span>
              <span class="clause-title">${clause.title}</span>
            </div>
            <i data-lucide="chevron-down" class="clause-chevron"></i>
          </div>
          <p class="clause-text">${clause.plainExplanation}</p>
          <div class="clause-body">
            <div class="clause-explanation">
              <div style="margin-bottom:8px;"><strong>Why it matters:</strong> ${clause.whyItMatters}</div>
              ${clause.originalText ? `
                <div style="margin:10px 0; padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:6px;" onclick="event.stopPropagation()">
                  <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:4px;">Original Contract Excerpt</div>
                  <div style="font-size:0.75rem; color:var(--text-secondary); font-style:italic; line-height:1.5;">"${clause.originalText}"</div>
                </div>` : ""}
              ${clause.redFlags?.length ? `
                <div style="margin-top:10px;">
                  <strong style="color:var(--risk-high); display:flex; align-items:center; gap:6px;"><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i> Red flags / Recommendations:</strong>
                  <ul style="margin-top:4px; padding-left:18px;">
                    ${clause.redFlags.map(f => `<li style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">${f}</li>`).join("")}
                  </ul>
                </div>` : ""}
            </div>
          </div>
        </div>`).join("")}

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-2" style="flex-wrap:wrap;">
        <button class="copy-btn" id="clauses-copy-btn"><i data-lucide="copy"></i> Copy Risk Analysis</button>
        <button class="copy-btn" id="clauses-download-btn"><i data-lucide="download"></i> Download Report</button>
        <button class="copy-btn" id="clauses-print-btn"><i data-lucide="printer"></i> Print / PDF</button>
      </div>
    </div>`;

  if (window.lucide) window.lucide.createIcons();

  // Copy
  document.getElementById("clauses-copy-btn")?.addEventListener("click", () => {
    const text = `LEXAI CLAUSE RISK ANALYSIS\n\nOverall Risk: ${overallRisk.toUpperCase()}\n${data.overallRiskSummary || data.scoreExplanation || ""}\n\nKey Clauses:\n` +
      clauses.map(c => `[${c.riskLevel.toUpperCase()}] ${c.title}\n${c.plainExplanation}\nWhy it matters: ${c.whyItMatters}\n`).join("\n");
    navigator.clipboard.writeText(text);
    showToast("Risk analysis copied!", "success");
  });

  // Download
  document.getElementById("clauses-download-btn")?.addEventListener("click", () => {
    const text = `# LexAI Clause Risk Analysis Report\n\n**Overall Risk:** ${overallRisk.toUpperCase()}\n\n${data.overallRiskSummary || data.scoreExplanation || ""}\n\n## Clause Analysis\n` +
      clauses.map(c => `### [${c.riskLevel.toUpperCase()}] ${c.title}\n- **Plain Meaning:** ${c.plainExplanation}\n- **Impact:** ${c.whyItMatters}\n${c.originalText ? `- **Original:** _"${c.originalText}"_\n` : ""}`).join("\n");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LexAI_Risk_Analysis.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded risk report!", "success");
  });

  // Print
  document.getElementById("clauses-print-btn")?.addEventListener("click", () => {
    window.print();
  });
}
