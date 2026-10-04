const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => MAP[c]);
}

/** Escape, then turn line breaks into <br> for HTML email bodies. */
export function escapeMultiline(value) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}
