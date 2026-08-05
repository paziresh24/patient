const BOT_UA_RE =
  /bot|crawler|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|googlebot|bingbot|yandex|baidu|duckduck|semrush|ahrefs|petalbot|bytespider|applebot|twitterbot|linkedinbot|embedly|quora|pinterest|redditbot|discordbot|skypeuripreview|ia_archiver|archive\.org|wget|curl|python-requests|httpclient|go-http-client|okhttp|java\//i;

/** Detect crawlers / preview bots from User-Agent (SSR or client). */
export function detectBot(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  return BOT_UA_RE.test(userAgent);
}

export function getClientUserAgent(): string | null {
  if (typeof window === 'undefined') return null;
  return window.navigator?.userAgent ?? null;
}
