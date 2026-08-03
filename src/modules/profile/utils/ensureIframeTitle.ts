/**
 * Ensures every <iframe> in HTML has an accessible title attribute.
 * Used for Aparat embeds on doctor profile.
 */
export function ensureIframeTitle(html: string, title: string): string {
  if (!html || typeof html !== 'string') return html;
  const safeTitle = String(title || 'ویدیو').replace(/"/g, '&quot;');

  return html.replace(/<iframe\b([^>]*)>/gi, (fullMatch, attrs: string) => {
    if (/\btitle\s*=/i.test(attrs)) return fullMatch;
    return `<iframe title="${safeTitle}"${attrs}>`;
  });
}
