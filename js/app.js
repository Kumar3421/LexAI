/**
 * LexAI — Main Application Orchestrator
 * Handles: settings, tab routing, Gemini init & Demo Mode, pill groups, feature init
 */

import { initGemini, isReady, hasApiKey, enableDemoMode, isDemoMode } from "./gemini.js";
import { showToast } from "./ui.js";
import { initSimplify } from "./simplify.js";
import { initCompare } from "./compare.js";
import { initQA } from "./qa.js";
import { initClauses } from "./clauses.js";
import { initChecklist } from "./checklist.js";
import { initPrepare } from "./prepare.js";

// ─── Storage Keys ─────────────────────────────────────────────
const KEY_API    = "lexai_api_key";
const KEY_MODEL  = "lexai_model";

// ─── App State ────────────────────────────────────────────────
let apiKey   = localStorage.getItem(KEY_API)   || "";
let model    = localStorage.getItem(KEY_MODEL) || "gemini-2.0-flash";

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Core UI shell & navigation first
  setupTabs();
  setupPillGroups();
  setupSettings();
  setupDemoCta();
  setupHelpModal();

  // If user has API key, initialize live Gemini; otherwise demo mode
  if (apiKey) {
    tryInitGemini(apiKey, model);
  } else {
    enableDemoMode(true);
    updateHeaderStatus();
  }

  // Defensively initialize all 6 legal features
  const features = [
    { name: "Simplify", fn: initSimplify },
    { name: "Compare", fn: initCompare },
    { name: "QA", fn: initQA },
    { name: "Clauses", fn: initClauses },
    { name: "Checklist", fn: initChecklist },
    { name: "Prepare", fn: initPrepare }
  ];

  features.forEach(({ name, fn }) => {
    try {
      fn();
    } catch (err) {
      console.error(`Failed to initialize ${name} feature:`, err);
    }
  });

  lucide.createIcons();
});

// ─── Tab Routing & Liquid Pointer Effects ──────────────────────
function setupTabs() {
  const nav    = document.getElementById("tabNav");
  const panels = document.getElementById("tabPanels");
  const heroBanner = document.getElementById("heroBanner");

  // Dynamic Liquid Mouse Tracker across Tab Navigation Lane
  if (nav) {
    nav.addEventListener("mousemove", (e) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      nav.style.setProperty("--nav-mouse-x", `${x}px`);
      nav.style.setProperty("--nav-mouse-y", `${y}px`);
      nav.classList.add("is-hovering");
    });

    nav.addEventListener("mouseleave", () => {
      nav.classList.remove("is-hovering");
    });

    // Localized button glass refraction
    nav.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--btn-mouse-x", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--btn-mouse-y", `${e.clientY - rect.top}px`);
      });
    });
  }

  nav?.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;

    const tab = btn.dataset.tab;

    // Smoothly minimize/hide hero when switching tabs
    if (heroBanner && !heroBanner.classList.contains("hidden")) {
      heroBanner.classList.add("hidden");
    }

    // Update buttons
    nav.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });

    // Update panels
    panels.querySelectorAll(".tab-panel").forEach(p => {
      p.classList.toggle("active", p.id === `panel-${tab}`);
    });

    // Re-render icons in active panel
    setTimeout(() => lucide.createIcons(), 50);
  });
}

// ─── Pill Groups ──────────────────────────────────────────────
function setupPillGroups() {
  document.querySelectorAll(".pill-group").forEach(group => {
    group.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill");
      if (!pill) return;
      group.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });
}

// ─── Demo Mode & Hero Setup ───────────────────────────────────
function setupDemoCta() {
  const heroDemoBtn    = document.getElementById("heroDemoBtn");
  const heroBanner     = document.getElementById("heroBanner");
  const enableDemoBtn  = document.getElementById("enableDemoBtn");
  const heroDismissBtn = document.getElementById("heroDismissBtn");

  const activateDemo = () => {
    enableDemoMode(true);
    updateHeaderStatus();
    if (heroBanner) heroBanner.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSettings();
    showToast("✨ Demo Mode active! Click any tab or sample contract to test.", "info", 4000);
  };

  heroDemoBtn?.addEventListener("click", activateDemo);
  enableDemoBtn?.addEventListener("click", activateDemo);
  heroDismissBtn?.addEventListener("click", () => {
    if (heroBanner) heroBanner.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── Help / About Modal ───────────────────────────────────────
function setupHelpModal() {
  const modal     = document.getElementById("helpModal");
  const helpBtn   = document.getElementById("helpBtn");
  const closeBtn  = document.getElementById("closeHelp");
  const closeBtn2 = document.getElementById("closeHelpBtn");

  const openModal  = () => { modal?.classList.add("open"); lucide.createIcons(); };
  const closeModal = () => modal?.classList.remove("open");

  helpBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  closeBtn2?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("open")) closeModal();
  });
}


// ─── Settings Modal ───────────────────────────────────────────
function setupSettings() {
  const modal       = document.getElementById("settingsModal");
  const settingsBtn = document.getElementById("settingsBtn");
  const statusChip  = document.getElementById("headerStatusChip");
  const closeBtn    = document.getElementById("closeSettings");
  const cancelBtn   = document.getElementById("cancelSettings");
  const saveBtn     = document.getElementById("saveSettings");
  const apiInput    = document.getElementById("api-key-input");
  const modelSel    = document.getElementById("model-select");
  const toggleBtn   = document.getElementById("toggleApiKey");
  const heroBanner  = document.getElementById("heroBanner");
  const heroCtaBtn  = document.getElementById("heroCtaBtn");

  // Pre-fill saved values
  if (apiKey)  apiInput.value = apiKey;
  if (model)   modelSel.value = model;
  updateApiStatus();
  updateHeaderStatus();

  // Open/close
  settingsBtn.addEventListener("click", openSettings);
  statusChip?.addEventListener("click", openSettings);
  closeBtn.addEventListener("click",   closeSettings);
  cancelBtn.addEventListener("click",  closeSettings);
  heroCtaBtn?.addEventListener("click", openSettings);

  // Overlay click to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeSettings();
  });

  // Toggle key visibility
  toggleBtn.addEventListener("click", () => {
    const isPassword = apiInput.type === "password";
    apiInput.type = isPassword ? "text" : "password";
    toggleBtn.querySelector("i").setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
    lucide.createIcons({ nodes: [toggleBtn] });
  });

  // Save Settings
  saveBtn.addEventListener("click", () => {
    const newKey   = apiInput.value.trim();
    const newModel = modelSel.value;

    if (!newKey) {
      // If cleared, switch to demo mode
      localStorage.removeItem(KEY_API);
      apiKey = "";
      enableDemoMode(true);
      closeSettings();
      updateHeaderStatus();
      updateApiStatus(null);
      showToast("API key removed. Running in Demo Mode.", "info");
      return;
    }

    apiKey = newKey;
    model  = newModel;
    localStorage.setItem(KEY_API, apiKey);
    localStorage.setItem(KEY_MODEL, model);

    const success = tryInitGemini(apiKey, model);
    if (success) {
      closeSettings();
      if (heroBanner) heroBanner.classList.add("hidden");
      showToast("✓ Connected to Google Gemini live!", "success");
      lucide.createIcons();
    }
    updateApiStatus();
    updateHeaderStatus();
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeSettings();
  });

  // If user already has an API key, collapse the hero banner
  if (apiKey) {
    if (heroBanner) heroBanner.classList.add("hidden");
  }
}

export function openSettings() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.classList.add("open");
    lucide.createIcons();
  }
}

export function closeSettings() {
  document.getElementById("settingsModal")?.classList.remove("open");
}

function tryInitGemini(key, modelName) {
  try {
    initGemini(key, modelName);
    updateApiStatus(true);
    updateHeaderStatus();
    return true;
  } catch (err) {
    updateApiStatus(false, err.message);
    updateHeaderStatus();
    showToast("Failed to initialize Gemini: " + err.message, "error");
    return false;
  }
}

function updateHeaderStatus() {
  const chip = document.getElementById("headerStatusChip");
  const text = document.getElementById("headerStatusText");
  if (!chip || !text) return;

  if (hasApiKey()) {
    chip.className = "status-chip live";
    text.textContent = `Live: ${model}`;
    chip.title = `Connected to Google Gemini (${model}). Click to change.`;
  } else {
    chip.className = "status-chip demo";
    text.textContent = "✦ Demo Mode";
    chip.title = "Running in Demo Mode. Click to add your Gemini API key.";
  }
}

function updateApiStatus(ok = null, errorMsg = "") {
  const dot  = document.getElementById("status-dot");
  const text = document.getElementById("status-text");

  if (!dot || !text) return;

  if (hasApiKey()) {
    dot.className  = "status-dot ok";
    text.textContent = `Connected · ${model}`;
  } else if (isDemoMode()) {
    dot.className  = "status-dot ok";
    text.textContent = "Demo Mode Active (Sample responses enabled)";
  } else if (ok === false) {
    dot.className  = "status-dot error";
    text.textContent = errorMsg || "Connection failed";
  } else {
    dot.className  = "status-dot";
    text.textContent = "No API key configured (Demo mode ready)";
  }
}
