/**
 * LexAI — Lawyer Prep Assistant Feature
 */

import { generate } from "./gemini.js";
import { setupUploadZone, truncateText } from "./document.js";
import { showToast, showSkeleton, showError } from "./ui.js";

let uploadedText = "";

export function initPrepare() {
  const zone       = document.getElementById("prepare-upload-zone");
  const fileIn     = document.getElementById("prepare-file-input");
  const situation  = document.getElementById("prepare-situation");
  const runBtn     = document.getElementById("prepare-run-btn");
  const output     = document.getElementById("prepare-output");
  const sampleBtn  = document.getElementById("prepare-sample-btn");

  setupUploadZone(zone, fileIn, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    uploadedText = text;
    showToast(`✓ ${file.name} loaded`, "success");
  });

  // Sample scenarios
  sampleBtn?.addEventListener("click", () => {
    situation.value = "I am a freelance full-stack software engineer. An enterprise client owes me $14,200 across 3 delivered milestone invoices. The web application is live in production, but the client refuses payment, citing a 'pay-when-paid' clause and minor subjective scope disagreements. I want to consult an attorney to recover the funds quickly and minimize legal expenses.";
    uploadedText = "";
    document.querySelectorAll("#prepare-area-group .pill").forEach(p => {
      p.classList.toggle("active", p.dataset.value === "contract");
    });
    showToast("✓ Loaded Unpaid Freelancer Invoices scenario", "success");
  });

  document.getElementById("prepare-sample-eviction")?.addEventListener("click", () => {
    situation.value = "My landlord served me an unexpected 3-day notice to quit or pay $1,500 in alleged undocumented property damage fees, threatening eviction proceedings. I have paid rent on time every month, have timestamped move-in photos, and believe this is retaliation for requesting heating repairs. I need urgent advice for talking to a tenant rights lawyer.";
    uploadedText = "";
    document.querySelectorAll("#prepare-area-group .pill").forEach(p => {
      p.classList.toggle("active", p.dataset.value === "property");
    });
    showToast("✓ Loaded Eviction Notice Dispute scenario", "success");
  });

  document.getElementById("prepare-sample-noncompete")?.addEventListener("click", () => {
    situation.value = "I recently left a technology startup to join another company in a similar sector. My former employer's counsel sent a formal Cease & Desist threatening a temporary restraining order (TRO) based on an overly broad 2-year nationwide non-compete clause in my exit paperwork. I need strategic questions for an employment litigation specialist.";
    uploadedText = "";
    document.querySelectorAll("#prepare-area-group .pill").forEach(p => {
      p.classList.toggle("active", p.dataset.value === "employment");
    });
    showToast("✓ Loaded Non-Compete Injunction Threat scenario", "success");
  });

  runBtn.addEventListener("click", async () => {
    const situationText = situation.value.trim();
    const docText = uploadedText || "";
    const area = document.querySelector("#prepare-area-group .pill.active")?.dataset.value || "general";

    if (!situationText && !docText) {
      showToast("Please describe your situation or upload a document.", "error");
      return;
    }

    showSkeleton(output, "Generating lawyer prep questions...");
    runBtn.disabled = true;
    runBtn.innerHTML = `<div class="spinner"></div> Generating...`;

    try {
      const prompt = buildPreparePrompt(situationText, docText, area);
      const result = await generate(prompt, { temperature: 0.6 });
      renderPrepareOutput(output, result);
    } catch (err) {
      showError(output, err.message);
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = `<i data-lucide="briefcase"></i> Generate Questions`;
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

function buildPreparePrompt(situation, docText, area) {
  return `You are an expert legal strategist helping a client prepare for a high-value consultation with a lawyer.

Return ONLY a valid JSON object (no markdown) with this structure:
{
  "situationOverview": "2-3 sentence summary of the client's position and core legal issue",
  "lawyerType": "Specific type of lawyer to look for (e.g. Commercial Litigation Attorney, Tenant Rights Specialist)",
  "timelineExpectation": "Realistic expectation of how long this legal matter typically takes to resolve",
  "costConsiderations": "Tips on legal fee models (hourly vs flat-fee vs contingency) and budgeting for this matter",
  "questionCategories": [
    {
      "categoryTitle": "e.g. Assessing the Merits, Strategy & Options, Costs & Timeline",
      "icon": "lucide icon name (e.g. help-circle, gavel, clock, dollar-sign)",
      "questions": [
        {
          "question": "Clear, specific question to ask the lawyer",
          "purpose": "Why this question is important for the client to ask",
          "goodAnswer": "What a good or reassuring answer from the lawyer would sound like"
        }
      ]
    }
  ],
  "documentsToGather": ["list of specific documents/evidence the client should bring to the first meeting"],
  "redFlags": ["warning signs about a bad or unaligned lawyer in this specific area"],
  "consultationTips": ["practical tips for maximizing their 30-60 min consultation"]
}

LEGAL AREA: ${area}
${situation ? `CLIENT'S SITUATION:\n${situation}\n` : ""}
${docText ? `DOCUMENT CONTEXT:\n---\n${truncateText(docText, 60000)}\n---` : ""}

Make the questions sharp, strategic, and practical. Aim for 3 categories with 2-4 questions each.`;
}

function renderPrepareOutput(output, rawResult) {
  let data;
  try {
    const clean = rawResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    data = JSON.parse(clean);
  } catch {
    output.innerHTML = `<div class="output-section"><div class="output-card"><p class="prose">${rawResult}</p></div></div>`;
    return;
  }

  const categories = data.questionCategories || data.categories || [];
  const totalQuestions = categories.reduce((a, c) => a + (c.questions ? c.questions.length : 0), 0);

  let allQuestionsText = `LEXAI LAWYER PREPARATION BRIEF\n\nSituation: ${data.situationOverview || ""}\nLawyer Specialty: ${data.lawyerType || data.lawyerSelectionAdvice || ""}\n\n`;
  categories.forEach(cat => {
    allQuestionsText += `\n### ${cat.categoryTitle}\n`;
    (cat.questions || []).forEach((q, i) => {
      allQuestionsText += `${i + 1}. ${q.question}\n   Why: ${q.purpose}\n`;
    });
  });

  output.innerHTML = `
    <div class="output-section">
      <div class="disclaimer-banner">
        <i data-lucide="info"></i>
        <span>These questions help you prepare for a consultation with a licensed attorney. They do not constitute legal advice.</span>
      </div>

      <!-- Overview card -->
      <div class="output-card" style="border-left:4px solid var(--rose); margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
          <span style="font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:99px; background:var(--rose-dim); color:var(--rose);">${totalQuestions} Strategic Questions</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${categories.length} Categories</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6; margin-bottom:10px;">${data.situationOverview || ""}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px;">
          <div style="padding:8px 10px; background:rgba(255,255,255,0.03); border-radius:6px; font-size:0.78rem;">
            <strong style="color:var(--text-primary); display:block; margin-bottom:2px;">👨‍⚖️ Lawyer Specialty</strong>
            <span style="color:var(--text-secondary);">${data.lawyerType || data.lawyerSelectionAdvice || "Commercial Attorney"}</span>
          </div>
          <div style="padding:8px 10px; background:rgba(255,255,255,0.03); border-radius:6px; font-size:0.78rem;">
            <strong style="color:var(--text-primary); display:block; margin-bottom:2px;">⏱️ Timeline Expectation</strong>
            <span style="color:var(--text-secondary);">${data.timelineExpectation || "2-6 weeks for initial demand"}</span>
          </div>
        </div>
      </div>

      <!-- Question Categories -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin:16px 0 10px 0;">
        <span class="output-title" style="margin:0;"><i data-lucide="help-circle"></i> Strategic Consultation Questions (${totalQuestions})</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">Click any question to open strategy details</span>
      </div>
      ${categories.map(cat => `
        <div class="question-cat">
          <div class="question-cat-header">
            <i data-lucide="${cat.icon || 'help-circle'}"></i>
            ${cat.categoryTitle}
          </div>
          ${(cat.questions || []).map((q, idx) => `
            <div class="question-item ${idx === 0 ? 'expanded' : ''}" onclick="this.classList.toggle('expanded')">
              <div class="question-num">${idx + 1}</div>
              <div class="question-body">
                <div class="question-header-row">
                  <div class="question-text">${q.question}</div>
                  <i data-lucide="chevron-down" class="question-chevron"></i>
                </div>
                <div class="question-details">
                  <div class="question-why"><strong>Strategic Purpose:</strong> ${q.purpose}</div>
                  ${q.goodAnswer ? `<div class="question-good-ans">✓ <strong>What a strong attorney response sounds like:</strong> ${q.goodAnswer}</div>` : ""}
                  <div style="margin-top:8px;">
                    <button type="button" class="copy-question-btn copy-btn" data-copy-q="${q.question.replace(/"/g, '&quot;')}" onclick="event.stopPropagation();" style="padding:3px 8px; font-size:0.7rem;">
                      <i data-lucide="copy" style="width:11px; height:11px;"></i> Copy Question
                    </button>
                  </div>
                </div>
              </div>
            </div>`).join("")}
        </div>`).join("")}

      <!-- Documents to gather -->
      ${data.documentsToGather?.length ? `
        <div class="output-card" style="border-left:4px solid var(--amber); background:var(--amber-dim); margin-top:12px;">
          <div class="output-title"><i data-lucide="folder-open"></i> Documents to Bring to Your Lawyer</div>
          <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:2;">
            ${data.documentsToGather.map(d => `<li>📄 ${d}</li>`).join("")}
          </ul>
        </div>` : ""}

      <!-- Red flags -->
      ${data.redFlags?.length ? `
        <div class="output-card" style="border-left:4px solid var(--risk-high); background:rgba(239,68,68,0.05); margin-top:12px;">
          <div class="output-title" style="color:var(--risk-high);"><i data-lucide="alert-circle"></i> Warning Signs in an Attorney</div>
          <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:2;">
            ${data.redFlags.map(r => `<li>🔴 ${r}</li>`).join("")}
          </ul>
        </div>` : ""}

      <!-- Consultation tips -->
      ${data.consultationTips?.length ? `
        <div class="output-card" style="border-left:4px solid var(--primary); background:var(--primary-dim); margin-top:12px;">
          <div class="output-title"><i data-lucide="lightbulb"></i> Consultation Tips</div>
          <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:2;">
            ${data.consultationTips.map(t => `<li>💡 ${t}</li>`).join("")}
          </ul>
        </div>` : ""}

      <!-- Action buttons -->
      <div class="flex gap-2 mt-2" style="flex-wrap:wrap;">
        <button class="copy-btn" id="prepare-copy-btn"><i data-lucide="copy"></i> Copy Questions</button>
        <button class="copy-btn" id="prepare-download-btn"><i data-lucide="download"></i> Download Brief</button>
        <button class="copy-btn" id="prepare-print-btn"><i data-lucide="printer"></i> Print / PDF</button>
      </div>
    </div>`;

  if (window.lucide) window.lucide.createIcons();

  // Delegated handler for individual copy-question buttons
  output.querySelectorAll(".copy-question-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const question = btn.dataset.copyQ || "";
      navigator.clipboard.writeText(question);
      showToast("Question copied to clipboard!", "success");
    });
  });

  // Copy
  document.getElementById("prepare-copy-btn")?.addEventListener("click", () => {
    navigator.clipboard.writeText(allQuestionsText);
    showToast("All questions copied!", "success");
  });

  // Download
  document.getElementById("prepare-download-btn")?.addEventListener("click", () => {
    const text = `# LexAI Lawyer Consultation Brief\n\n**Situation:** ${data.situationOverview || ""}\n**Target Counsel:** ${data.lawyerType || data.lawyerSelectionAdvice || ""}\n\n` +
      categories.map(cat =>
        `### ${cat.categoryTitle}\n` +
        (cat.questions || []).map((q, idx) => `${idx + 1}. **${q.question}**\n   - *Purpose:* ${q.purpose}`).join("\n")
      ).join("\n\n") +
      (data.documentsToGather?.length ? `\n\n### Documents to Bring\n${data.documentsToGather.map(d => `- 📄 ${d}`).join("\n")}` : "") +
      (data.consultationTips?.length ? `\n\n### Tips for the Consultation\n${data.consultationTips.map(t => `- 💡 ${t}`).join("\n")}` : "");

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LexAI_Lawyer_Prep_Brief.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded prep brief!", "success");
  });

  // Print
  document.getElementById("prepare-print-btn")?.addEventListener("click", () => {
    window.print();
  });
}
