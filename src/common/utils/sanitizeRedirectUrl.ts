const ALLOWED_REDIRECT_HOST_SUFFIXES = ['paziresh24.com', 'p24cloud.ir'] as const;

function isAllowedRedirectHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_REDIRECT_HOST_SUFFIXES.some(
    suffix => host === suffix || host.endsWith(`.${suffix}`),
  );
}

/**
 * Validate post-login redirect targets (open-redirect prevention).
 * Allows relative paths and absolute http(s) URLs on *.paziresh24.com / *.p24cloud.ir.
 * Rejects lookalikes like paziresh24.com.evil.com (substring hostname checks are unsafe).
 */
export function sanitizeRedirectUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== 'string') {
    return null;
  }

  let url = rawUrl.trim();
  if (!url) {
    return null;
  }

  try {
    // Match prior login decoding (double-encoded query values).
    url = decodeURIComponent(url);
    try {
      url = decodeURI(url);
    } catch {
      // keep decodeURIComponent result
    }
  } catch {
    return null;
  }

  if (/[\x00-\x1F\x7F\\]/.test(url)) {
    return null;
  }

  if (/^(javascript|data|vbscript|file):/i.test(url)) {
    return null;
  }

  // Protocol-relative URLs (//evil.com) — must reject before relative-path check
  if (url.startsWith('//')) {
    return null;
  }

  if (url.startsWith('/')) {
    if (url.includes('..')) {
      return null;
    }
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    if (parsed.username || parsed.password) {
      return null;
    }
    if (!isAllowedRedirectHost(parsed.hostname)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}
