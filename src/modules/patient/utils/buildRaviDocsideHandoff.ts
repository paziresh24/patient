export const RAVI_DOCSIDE_HANDOFF_PATH = '/dashboard/ravi-docside-handoff';

/** Same-origin iframe src so the httpOnly session cookie is sent to Next.js. */
export function buildRaviDocsideHandoffSrc(): string {
  return RAVI_DOCSIDE_HANDOFF_PATH;
}

export function raviDocsideHandoffCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'private, no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
  };
}
