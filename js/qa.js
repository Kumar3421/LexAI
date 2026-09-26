/**
 * LexAI — Legal Q&A Chat Feature
 */

import { createChatSession } from "./gemini.js";
import { setupUploadZone, truncateText } from "./document.js";
import { showToast, renderMarkdown } from "./ui.js";
import { SAMPLES } from "./samples.js";

let chatSession = null;
let documentContext = "";
let documentName = "";

export function initQA() {
  const zone      = document.getElementById("qa-upload-zone");
  const fileIn    = document.getElementById("qa-file-input");
  const docStatus = document.getElementById("qa-doc-status");
  const docName   = document.getElementById("qa-doc-name");
  const clearDoc  = document.getElementById("qa-clear-doc");
  const clearBtn  = document.getElementById("qa-clear-btn");
  const chatInput = document.getElementById("chat-input");
  const sendBtn   = document.getElementById("chat-send-btn");
  const messages  = document.getElementById("chat-messages");
  const chips     = document.querySelectorAll(".suggestion-chip");
  const qaSampleBtn = document.getElementById("qa-sample-btn");

  // Sample context buttons
  qaSampleBtn?.addEventListener("click", () => {
    documentContext = SAMPLES.nda.text;
    documentName = "Sample_Mutual_NDA.pdf";
    docName.textContent = documentName;
    docStatus.classList.remove("hidden");
    resetChat();
    showToast("✓ Loaded Sample Mutual NDA as context", "success");
  });

  document.getElementById("qa-sample-lease")?.addEventListener("click", () => {
    documentContext = SAMPLES.lease.text;
    documentName = "Oakwood_Apartment_Lease.pdf";
    docName.textContent = documentName;
    docStatus.classList.remove("hidden");
    resetChat();
    showToast("✓ Loaded Apartment Lease as context", "success");
  });

  document.getElementById("qa-sample-contractor")?.addEventListener("click", () => {
    documentContext = SAMPLES.consulting.text;
    documentName = "Apex_Contractor_Agreement.pdf";
    docName.textContent = documentName;
    docStatus.classList.remove("hidden");
    resetChat();
    showToast("✓ Loaded High-Risk Contractor Agreement as context", "success");
  });

  // Document upload
  setupUploadZone(zone, fileIn, (file, text, err) => {
    if (err) { showToast(err, "error"); return; }
    documentContext = text;
    documentName = file.name;
    docName.textContent = file.name;
    docStatus.classList.remove("hidden");
    resetChat();
    showToast(`✓ ${file.name} loaded as context`, "success");
  });

  clearDoc.addEventListener("click", () => {
    documentContext = "";
    documentName = "";
    docStatus.classList.add("hidden");
    resetChat();
  });

  // Clear conversation
  clearBtn.addEventListener("click", () => {
    resetChat();
    showToast("Conversation cleared", "info");
  });

  // Send message
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  // Suggestion chips
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chatInput.value = chip.dataset.q;
      chatInput.dispatchEvent(new Event("input"));
      sendMessage();
    });
  });

  function resetChat() {
    chatSession = null;
    messages.innerHTML = `
      <div class="chat-welcome">
        <div class="welcome-icon"><i data-lucide="bot"></i></div>
        <h3>Hello! I'm your legal AI assistant.</h3>
        <p>${documentContext ? `I've loaded <strong>${documentName}</strong> as context. Ask me anything about it!` : "Upload a document or just ask me anything about legal topics. I'll provide information to help you understand — not replace professional legal advice."}</p>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
  }

  function getOrCreateSession() {
    if (!chatSession) {
      const systemPrompt = `You are LexAI, a helpful and knowledgeable AI legal assistant. Your role is to:
1. Help users understand legal documents, terms, and concepts in plain language
2. Answer questions about legal topics clearly and accurately
3. Highlight important information, risks, and considerations
4. Help users prepare for conversations with their lawyers
5. Always remind users that your answers are informational only and not a substitute for professional legal advice

${documentContext ? `DOCUMENT CONTEXT (the user has uploaded this document for reference):
---
${truncateText(documentContext, 80000)}
---
When answering questions, prioritize information from this document. If the answer is in the document, quote or reference the relevant section. If you're drawing on general legal knowledge, clearly say so.` : "No document has been uploaded. Answer based on general legal knowledge and be clear about jurisdictional variations where relevant."}

Always be helpful, clear, and empathetic. Format your answers with markdown for readability. End complex answers with a brief disclaimer about seeking professional advice.`;

      chatSession = createChatSession(systemPrompt);
    }
    return chatSession;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Clear input
    chatInput.value = "";
    chatInput.style.height = "auto";

    // Remove welcome message if present
    const welcome = messages.querySelector(".chat-welcome");
    if (welcome) welcome.remove();

    // Add user message
    appendMessage("user", text, messages);

    // Add typing indicator
    const typingEl = appendTyping(messages);
    sendBtn.disabled = true;

    try {
      const session = getOrCreateSession();
      const result = await session.sendMessage(text);
      const response = result.response.text();
      typingEl.remove();
      appendMessage("ai", response, messages);
    } catch (err) {
      typingEl.remove();
      appendMessage("ai", `⚠️ Error: ${err.message}\n\nPlease check your API key in Settings and try again.`, messages);
    } finally {
      sendBtn.disabled = false;
    }
  }
}

function appendMessage(role, text, container) {
  const isUser = role === "user";
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar">
      ${isUser ? "U" : `<i data-lucide="bot"></i>`}
    </div>
    <div class="msg-bubble">
      ${isUser ? `<span style="white-space:pre-wrap;">${escapeHtml(text)}</span>` : `<div class="prose">${renderMarkdown(text)}</div>`}
    </div>`;
  container.appendChild(div);
  if (window.lucide) window.lucide.createIcons({ nodes: [div] });
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendTyping(container) {
  const div = document.createElement("div");
  div.className = "msg ai";
  div.innerHTML = `
    <div class="msg-avatar"><i data-lucide="bot"></i></div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  container.appendChild(div);
  if (window.lucide) window.lucide.createIcons({ nodes: [div] });
  container.scrollTop = container.scrollHeight;
  return div;
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
