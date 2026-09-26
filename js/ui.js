/**
 * LexAI — UI Utilities
 * Shared rendering helpers used across all feature modules
 */

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration ms
 */
export function showToast(message, type = "info", duration = 3500) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const iconMap = { success: "check-circle", error: "x-circle", info: "info" };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i data-lucide="${iconMap[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);

  if (window.lucide) window.lucide.createIcons({ nodes: [toast] });

  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse";
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

/**
 * Show a skeleton loading state in an output container
 */
export function showSkeleton(container, message = "Analyzing...") {
  container.innerHTML = `
    <div class="output-section" style="padding:8px;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:24px; color:var(--text-muted); font-size:0.85rem;">
        <div class="spinner" style="border-top-color:var(--primary); width:16px; height:16px; border-width:2px;"></div>
        ${message}
      </div>
      <div class="skeleton skeleton-title" style="margin-bottom:20px;"></div>
      <div class="skeleton skeleton-line w-full"></div>
      <div class="skeleton skeleton-line w-3/4"></div>
      <div class="skeleton skeleton-line w-full"></div>
      <div class="skeleton skeleton-line w-1/2"></div>
      <div style="margin-top:20px;">
        <div class="skeleton skeleton-title" style="width:40%; margin-bottom:14px;"></div>
        <div class="skeleton skeleton-line w-full"></div>
        <div class="skeleton skeleton-line w-3/4"></div>
        <div class="skeleton skeleton-line w-full"></div>
      </div>
      <div style="margin-top:20px;">
        <div class="skeleton skeleton-title" style="width:50%; margin-bottom:14px;"></div>
        <div class="skeleton skeleton-line w-full"></div>
        <div class="skeleton skeleton-line w-1/2"></div>
      </div>
    </div>`;
}

/**
 * Show an error state in an output container
 */
export function showError(container, message) {
  container.innerHTML = `
    <div class="output-section">
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:60px 40px; text-align:center;">
        <div style="width:56px; height:56px; border-radius:50%; background:rgba(244,63,94,0.1); display:flex; align-items:center; justify-content:center;">
          <i data-lucide="alert-circle" style="width:28px; height:28px; color:var(--rose);"></i>
        </div>
        <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary);">Something went wrong</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); max-width:320px; line-height:1.6;">${message}</p>
        <p style="font-size:0.78rem; color:var(--text-muted);">Check your API key in <strong>Settings</strong> and try again.</p>
      </div>
    </div>`;
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Convert simple markdown to HTML
 * Handles: headers, bold, italic, code, links, lists, blockquotes, hr
 */
export function renderMarkdown(text) {
  if (!text) return "";

  let html = text
    // Escape potential XSS
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")

    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")

    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")

    // Horizontal rule
    .replace(/^---+$/gm, "<hr>")

    // Blockquotes
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")

    // Unordered lists
    .replace(/^\s*[-*+] (.+)$/gm, "<li>$1</li>")

    // Numbered lists
    .replace(/^\s*\d+\. (.+)$/gm, "<li>$1</li>")

    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--text-link);">$1</a>')

    // Paragraphs — double newline
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br>");

  // Merge consecutive blockquotes
  html = html.replace(/(<\/blockquote>)\s*(<blockquote>)/g, "<br>");

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((<li>.*?<\/li>\s*)+)/g, "<ul>$1</ul>");

  return `<p>${html}</p>`;
}
