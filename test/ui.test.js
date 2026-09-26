import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../js/ui.js";

test("renderMarkdown converts headings and emphasis", () => {
  const html = renderMarkdown("## Legal Summary\n\n**Important** clause");
  assert.match(html, /<h2>Legal Summary<\/h2>/);
  assert.match(html, /<strong>Important<\/strong>/);
});

test("renderMarkdown escapes HTML to reduce XSS risk", () => {
  const html = renderMarkdown('<script>alert("x")</script>');
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
