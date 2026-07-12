const CONTROL_OR_BACKSLASH = /[\x00-\x1f\x7f\\]/;

function tryDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function isSafeRelativeRedirectPath(path: string, baseOrigin: string): boolean {
  const decoded = tryDecode(path);
  if (!decoded || !decoded.startsWith('/') || decoded.startsWith('//')) {
    return false;
  }

  if (CONTROL_OR_BACKSLASH.test(decoded)) {
    return false;
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded.slice(1))) {
    return false;
  }

  try {
    const resolved = new URL(decoded, baseOrigin);
    const base = new URL(baseOrigin);

    return resolved.origin === base.origin && resolved.pathname.startsWith('/');
  } catch {
    return false;
  }
}

export function isAllowedPaziresh24AbsoluteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    if (CONTROL_OR_BACKSLASH.test(url)) {
      return false;
    }

    return parsed.hostname === 'paziresh24.com' || parsed.hostname.endsWith('.paziresh24.com');
  } catch {
    return false;
  }
}

export function resolveSafeRedirectUrl(redirectUrl: string | undefined, baseOrigin: string, fallback = '/'): string {
  if (!redirectUrl) {
    return fallback;
  }

  const decoded = tryDecode(redirectUrl) ?? redirectUrl;

  if (isAllowedPaziresh24AbsoluteUrl(decoded)) {
    const parsed = new URL(decoded);
    return parsed.pathname + parsed.search + parsed.hash;
  }

  if (isSafeRelativeRedirectPath(decoded, baseOrigin)) {
    const resolved = new URL(decoded, baseOrigin);
    return resolved.pathname + resolved.search + resolved.hash;
  }

  return fallback;
}
