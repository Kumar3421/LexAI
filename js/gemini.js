/**
 * LexAI — Gemini API Client with Live API & Instant Demo Mode Support
 * Wraps Google Generative AI SDK for all AI feature calls
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_RESPONSES } from "./mock_data.js";

let _client = null;
let _model = null;
let _modelName = "gemini-2.0-flash";
let _demoMode = false;

/**
 * Initialize or reinitialize the Gemini client
 */
export function initGemini(apiKey, modelName = "gemini-2.0-flash") {
  if (!apiKey) {
    _model = null;
    _client = null;
    return null;
  }
  _modelName = modelName;
  _client = new GoogleGenerativeAI(apiKey);
  _model = _client.getGenerativeModel({ model: modelName });
  _demoMode = false;
  return _model;
}

export function enableDemoMode(val = true) {
  _demoMode = val;
}

export function isDemoMode() {
  return _demoMode;
}

/**
 * Get the current model instance
 */
export function getModel() {
  return _model;
}

/**
 * Check if Gemini is ready to use (either live API key or Demo Mode)
 */
export function isReady() {
  return _model !== null || _demoMode;
}

export function hasApiKey() {
  return _model !== null;
}

/**
 * Simple text generation
 */
export async function generate(prompt, { temperature = 0.7, maxTokens = 8192 } = {}) {
  if (_model) {
    try {
      const result = await _model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      });
      return result.response.text();
    } catch (err) {
      console.warn("Live Gemini API call failed, evaluating fallback:", err);
      // If error is invalid API key or quota exceeded and demo is viable, fall back
      if (_demoMode || !hasApiKey()) {
        return getMockResponseForPrompt(prompt);
      }
      throw err;
    }
  }

  // Demo / fallback mode
  await new Promise(r => setTimeout(r, 600)); // realistic thinking delay
  return getMockResponseForPrompt(prompt);
}

/**
 * Streaming text generation — calls onChunk with each token
 */
export async function generateStream(prompt, onChunk, { temperature = 0.7 } = {}) {
  if (_model) {
    try {
      const result = await _model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature },
      });

      let fullText = "";
      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        onChunk(text, fullText);
      }
      return fullText;
    } catch (err) {
      console.warn("Live Gemini stream call failed, evaluating fallback:", err);
      if (!_demoMode && hasApiKey()) throw err;
    }
  }

  // Demo streaming simulation (token-by-token feel)
  const fullText = getMockResponseForPrompt(prompt);
  const words = fullText.split(" ");
  let streamed = "";

  for (let i = 0; i < words.length; i++) {
    const piece = (i === 0 ? "" : " ") + words[i];
    streamed += piece;
    onChunk(piece, streamed);
    // short delay every 4 words to simulate streaming
    if (i % 4 === 0) {
      await new Promise(r => setTimeout(r, 18));
    }
  }
  return streamed;
}

/**
 * Chat session for multi-turn conversation
 */
export function createChatSession(systemPrompt = "") {
  if (_model) {
    const history = systemPrompt
      ? [{ role: "user", parts: [{ text: systemPrompt }] }, { role: "model", parts: [{ text: "Understood. I will follow those instructions." }] }]
      : [];

    return _model.startChat({ history, generationConfig: { temperature: 0.6 } });
  }

  // Simulated Chat Session for Demo Mode
  return {
    async sendMessage(userMessage) {
      await new Promise(r => setTimeout(r, 800));
      const lower = userMessage.toLowerCase();

      let reply = "";
      if (lower.includes("obligation") || lower.includes("must do")) {
        reply = `### Key Obligations Identified in the Agreement\n\nBased on the document context:\n\n1. **Strict Confidentiality**: You must hold all confidential information in strict confidence and avoid disclosure to any unauthorized third parties.\n2. **Standard of Care**: You must use at least standard reasonable care to safeguard trade secrets.\n3. **Access Limitation**: You may only provide access to team members with a legitimate need-to-know.\n4. **Return of Materials**: Upon written request or termination, you are legally bound to destroy or return all documents within 10 days.\n\n*Note: Liquidated damages of $50,000 apply to willful breaches.*`;
      } else if (lower.includes("deadline") || lower.includes("date") || lower.includes("term")) {
        reply = `### Important Dates & Deadlines\n\n* **Effective Date**: October 15, 2025\n* **Term of Disclosures**: Valid for **2 years** from the effective date.\n* **Survival Period**: Confidentiality obligations survive for **3 years** following conclusion of talks, while trade secrets remain protected indefinitely.\n* **Governing Jurisdiction**: Legal suits must be brought in Delaware state/federal courts.`;
      } else if (lower.includes("risk") || lower.includes("unusual") || lower.includes("danger") || lower.includes("breach")) {
        reply = `### Notable Risks in this Agreement\n\n⚠️ **Liquidated Damages Clause ($50,000)**: Section 8 stipulates fixed damages of $50,000 per violation without requiring the other party to demonstrate actual monetary loss.\n\n⚠️ **Delaware Venue**: Section 9 mandates Delaware courts, which may impose travel and out-of-state attorney expenses.\n\n*Recommendation: Seek to negotiate the liquidated damages clause down or replace it with standard actual provable damages.*`;
      } else if (lower.includes("terminate") || lower.includes("cancel") || lower.includes("end")) {
        reply = `### Termination Provisions\n\nEither party may terminate the business discussions at will upon written notice. However:\n\n* The **confidentiality duties survive for 3 years** after discussions terminate.\n* You must return or certify destruction of all confidential materials within 10 days of termination notice.\n* Trade secrets are protected indefinitely even after termination.`;
      } else if (lower.includes("deposit") || lower.includes("landlord") || lower.includes("rent")) {
        reply = `### Lease & Security Deposit Analysis\n\nUnder residential landlord-tenant principles:\n\n1. **Security Deposit Timeline**: Most jurisdictions mandate return within 14–30 days. Deductions must be strictly itemized with receipts.\n2. **Normal Wear and Tear**: Landlords cannot deduct for normal everyday wear (e.g. minor paint scuffs, reasonable carpet traffic).\n3. **Remedies**: If withheld in bad faith, tenants in many states (such as CA, NY, IL) can recover up to 2x or 3x the deposit amount in statutory punitive damages.\n\n*Tip: Always send a formal Demand Letter via certified mail before filing in small claims court.*`;
      } else if (lower.includes("pay") || lower.includes("invoice") || lower.includes("contractor") || lower.includes("ip") || lower.includes("inventions")) {
        reply = `### Independent Contractor & IP Analysis\n\nKey principles for service agreements:\n\n1. **Pay-When-Paid Clauses**: Shift customer credit risk onto the contractor. In some states, courts disfavor these clauses unless explicitly written as an unequivocal condition precedent.\n2. **IP Assignment Overreach**: Contracts assigning inventions created on personal time or prior inventions are often unconscionable. Statutory carve-outs (e.g. Cal. Labor Code § 2870) protect personal inventions.\n3. **Remedies**: If client uses your software without paying, you may assert copyright infringement and immediately revoke their implied software license.`;
      } else {
        reply = `Thank you for your question regarding: "${userMessage}".\n\nIn standard contract analysis, this clause revolves around balancing mutual duties of good faith and risk allocation. If this relates to your uploaded document, make sure that:\n\n1. The definition of the terms is unambiguous.\n2. Notice requirements (e.g. written notice via certified mail) are strictly met.\n3. Remedy options are clearly bounded.\n\n*ℹ️ This guidance is informational only and should not replace advice from a licensed attorney.*`;
      }

      return {
        response: {
          text: () => reply
        }
      };
    }
  };
}

/**
 * Match prompt content to corresponding mock response
 */
function getMockResponseForPrompt(prompt) {
  // 1. Contract Comparator
  if (prompt.includes("CONTRACT COMPARATOR") || prompt.includes("Compare the two legal documents") || prompt.includes("riskScoreA")) {
    return JSON.stringify(MOCK_RESPONSES.compare);
  }

  // 2. Risk Scanner
  if (prompt.includes("RISK SCANNER") || prompt.includes("Analyze the following legal document") || prompt.includes("overallRiskSummary") || prompt.includes("scoreExplanation") || prompt.includes("Identify and assess risky clauses")) {
    if (prompt.includes("RESIDENTIAL LEASE") || prompt.includes("Oakwood") || prompt.includes("Evergreen Terrace") || prompt.includes("Apartment Lease")) {
      return JSON.stringify(MOCK_RESPONSES.clausesLease);
    }
    return JSON.stringify(MOCK_RESPONSES.clauses);
  }

  // 3. Action Checklist
  if (prompt.includes("prioritized action checklist") || prompt.includes("situationSummary") || prompt.includes("urgencyLevel")) {
    if (prompt.includes("apartment lease") || prompt.includes("Springfield") || prompt.includes("Signing Apartment Lease") || prompt.includes("12-month apartment lease")) {
      return JSON.stringify(MOCK_RESPONSES.checklistLease);
    }
    if (prompt.includes("freelance") || prompt.includes("freelancer") || prompt.includes("invoice") || prompt.includes("contractor") || prompt.includes("unpaid")) {
      return JSON.stringify(MOCK_RESPONSES.checklistContractor || MOCK_RESPONSES.checklist);
    }
    return JSON.stringify(MOCK_RESPONSES.checklist);
  }

  // 4. Lawyer Prep
  if (prompt.includes("consultation with a lawyer") || prompt.includes("lawyerSelectionAdvice") || prompt.includes("questionCategories") || prompt.includes("Lawyer Prep") || prompt.includes("documentsToGather")) {
    if (prompt.includes("eviction") || prompt.includes("3-day notice") || prompt.includes("quit or pay") || prompt.includes("landlord")) {
      return JSON.stringify(MOCK_RESPONSES.prepareEviction || MOCK_RESPONSES.prepare);
    }
    if (prompt.includes("non-compete") || prompt.includes("Cease & Desist") || prompt.includes("restraining order") || prompt.includes("injunction")) {
      return JSON.stringify(MOCK_RESPONSES.prepareNonCompete || MOCK_RESPONSES.prepare);
    }
    return JSON.stringify(MOCK_RESPONSES.prepare);
  }

  // 5. Document Simplifier
  if (prompt.includes("5th grader") || prompt.includes("elementary")) {
    return MOCK_RESPONSES.simplifyElementary;
  }
  if (prompt.includes("RESIDENTIAL LEASE") || prompt.includes("Oakwood") || prompt.includes("Evergreen Terrace") || prompt.includes("Apartment Lease")) {
    return MOCK_RESPONSES.simplifyLease;
  }
  if (prompt.includes("INDEPENDENT CONTRACTOR") || prompt.includes("Apex Media") || prompt.includes("Contractor Agreement") || prompt.includes("Alex Smith")) {
    return MOCK_RESPONSES.simplifyConsulting;
  }
  return MOCK_RESPONSES.simplify;
}

export { _modelName as currentModelName };
