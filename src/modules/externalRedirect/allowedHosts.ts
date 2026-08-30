/**
 * Hosts an external-profile card is allowed to hand a patient over to.
 *
 * This is an allowlist, not a filter: `/go` takes a destination from the query
 * string, so without it the page is an open redirect that any phishing link can
 * point at paziresh24.com and borrow our domain's credibility. A host reaches
 * this list only when a DR-09 external document is written for it, so the list
 * and the documents in `slim_clinic` stay in step.
 */
export const ALLOWED_EXTERNAL_HOSTS = ['rayteb.tamin.ir', 'nobatdisfahan.tamin.ir', 'nobat.tamin.ir'] as const;

/** Suffix match so `sub.host` of an allowed host is allowed, `evil-rayteb.tamin.ir.attacker.com` is not. */
export const isAllowedExternalUrl = (raw: string): boolean => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  return ALLOWED_EXTERNAL_HOSTS.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
};
