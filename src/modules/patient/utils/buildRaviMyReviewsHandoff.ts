export const RAVI_MY_REVIEWS_HANDOFF_PATH = '/dashboard/ravi-my-reviews-handoff';

/** Same-origin iframe src so the httpOnly session cookie is sent to Next.js. */
export function buildRaviMyReviewsHandoffSrc(): string {
  return RAVI_MY_REVIEWS_HANDOFF_PATH;
}

export function raviMyReviewsHandoffCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'private, no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
  };
}

export function readRequestSessionToken(cookies?: Partial<Record<string, string>>): string | undefined {
  const raw = cookies?.token;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
}
