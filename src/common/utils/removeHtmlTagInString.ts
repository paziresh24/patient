/**
 * Strip HTML to plain text without XSS risk.
 * Handles entity-encoded markup from APIs (e.g. `&lt;h2&gt;…&lt;/h2&gt;`) by decoding
 * then removing tags; leftover `<`/`>` are dropped so the result is safe even when
 * callers put it into `dangerouslySetInnerHTML`.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body: string) => {
      const key = body.toLowerCase();
      if (key in NAMED_ENTITIES) return NAMED_ENTITIES[key];
      if (key.startsWith('#x')) {
        const code = Number.parseInt(key.slice(2), 16);
        return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
      }
      if (key.startsWith('#')) {
        const code = Number.parseInt(key.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
      }
      return entity;
    });

export const removeHtmlTagInString = (str: string = '') => {
  if (!str) return '';

  let out = String(str);
  for (let i = 0; i < 4; i += 1) {
    const next = decodeHtmlEntities(out).replace(/<[^>]*>/gi, '');
    if (next === out) break;
    out = next;
  }

  // Drop any residual angle brackets so encoded/malformed markup cannot reintroduce tags.
  return out.replace(/[<>]/g, '');
};

export default removeHtmlTagInString;
