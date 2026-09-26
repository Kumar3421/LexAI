/**
 * LexAI — Document handling utilities
 * PDF text extraction (PDF.js) + plain text handling
 */

// Configure PDF.js worker
if (typeof pdfjsLib !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

/**
 * Extract text from a File object (PDF or TXT)
 */
export async function extractTextFromFile(file) {
  if (!file) return "";

  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "txt") {
    return await file.text();
  }

  if (ext === "pdf") {
    return await extractPDFText(file);
  }

  // Fallback: try reading as text
  return await file.text();
}

/**
 * Extract text from a PDF file using PDF.js
 */
async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }

  return fullText.trim();
}

/**
 * Truncate text to a safe token length for Gemini
 * Roughly 4 chars per token; 100k token window -> ~300k chars
 * We cap at 150k chars to be safe
 */
export function truncateText(text, maxChars = 150000) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[... document truncated for length ...]";
}

/**
 * Setup drag-and-drop + click upload for an upload zone element
 * Returns a reactive object with { file, text }
 */
export function setupUploadZone(zoneEl, fileInputEl, onLoad) {
  if (!zoneEl || !fileInputEl) return;

  // Click anywhere on zone triggers file input
  zoneEl.addEventListener("click", (e) => {
    // If the click is already on the file input itself or a button, do nothing
    if (e.target === fileInputEl || e.target.closest("button")) return;
    fileInputEl.click();
  });

  // File input change
  fileInputEl.addEventListener("change", () => {
    const file = fileInputEl.files[0];
    if (file) handleFile(file);
  });

  // Drag events
  zoneEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    zoneEl.classList.add("dragover");
  });
  zoneEl.addEventListener("dragleave", () => zoneEl.classList.remove("dragover"));
  zoneEl.addEventListener("drop", (e) => {
    e.preventDefault();
    zoneEl.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  async function handleFile(file) {
    const allowed = ["pdf", "txt"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      onLoad(null, null, `Unsupported file type: .${ext}. Please use PDF or TXT.`);
      return;
    }

    // Show loading state on zone
    const origHTML = zoneEl.innerHTML;
    zoneEl.innerHTML = `
      <div class="spinner" style="border-top-color: var(--primary);"></div>
      <p style="font-size:0.78rem; color:var(--text-muted);">Extracting text...</p>
    `;

    try {
      const text = await extractTextFromFile(file);
      zoneEl.classList.add("loaded");
      zoneEl.innerHTML = `
        <i data-lucide="check-circle"></i>
        <p>${file.name}</p>
        <span class="upload-hint">${(file.size / 1024).toFixed(1)} KB · ${text.length.toLocaleString()} chars extracted</span>
      `;
      if (window.lucide) window.lucide.createIcons({ nodes: [zoneEl] });
      onLoad(file, text, null);
    } catch (err) {
      zoneEl.innerHTML = origHTML;
      if (window.lucide) window.lucide.createIcons({ nodes: [zoneEl] });
      onLoad(null, null, `Failed to read file: ${err.message}`);
    }
  }
}
