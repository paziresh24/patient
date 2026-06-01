export const HAMI_ORIGIN = 'https://hami.paziresh24.com';

export const VARDAST_DRAWER_FEATURE_FLAG = 'varsdast-drawer';

export const getHamiPathFromUrl = (url: string) => {
  try {
    const raw = url?.trim();
    if (!raw) return null;

    if (raw.startsWith('/')) return raw;

    const candidate = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
    const parsed = new URL(candidate);
    if (parsed.origin !== HAMI_ORIGIN) return null;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
};

export const toAppChatsRouteFromHamiPath = (hamiPath: string) => {
  const normalized = (hamiPath.startsWith('/') ? hamiPath : `/${hamiPath}`).replace(/\/+$/, '') || '/';

  if (normalized === '/' || normalized === '/chats') return '/_/chats';

  const chatsMatch = normalized.match(/^\/chats\/([^/?#]+)/i);
  if (chatsMatch?.[1]) return `/_/chats/${encodeURIComponent(chatsMatch[1])}`;

  // Legacy path from older Hami routes.
  const chatMatch = normalized.match(/^\/chat\/([^/?#]+)/i);
  if (chatMatch?.[1]) return `/_/chats/${encodeURIComponent(chatMatch[1])}`;

  if (normalized.toLowerCase().startsWith('/stories')) return `/_/chats${normalized}`;

  return '/_/chats';
};

export const toHamiPathFromAppRoute = (hamiSegments?: string | string[]) => {
  const segments = Array.isArray(hamiSegments) ? hamiSegments : hamiSegments ? [hamiSegments] : [];

  if (!segments.length) return '/';

  if (segments[0] === 'stories') {
    const rest = segments.slice(1).join('/');
    return rest ? `/stories/${rest}` : '/stories';
  }

  if (segments.length === 1) return `/chats/${decodeURIComponent(segments[0])}`;

  return `/${segments.join('/')}`;
};

export const getHamiChatIdFromAppRoute = (hamiSegments?: string | string[]) => {
  const segments = Array.isArray(hamiSegments) ? hamiSegments : hamiSegments ? [hamiSegments] : [];
  if (segments.length !== 1 || segments[0] === 'stories') return null;
  return decodeURIComponent(segments[0]);
};

export const isHamiChatDetailFromAppRoute = (hamiSegments?: string | string[]) => {
  const segments = Array.isArray(hamiSegments) ? hamiSegments : hamiSegments ? [hamiSegments] : [];
  return segments.length === 1 && segments[0] !== 'stories';
};

export const isHamiChatDetailUrl = (url: string) => {
  try {
    const raw = url?.trim();
    if (!raw) return false;

    let pathname: string;
    if (raw.startsWith('/')) {
      pathname = raw;
    } else {
      const candidate = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
      pathname = new URL(candidate).pathname;
    }

    const path = pathname.replace(/\/+$/, '') || '/';
    return /^\/chats\/[^/]+/i.test(path) || /^\/chat\/[^/]+/i.test(path);
  } catch {
    return false;
  }
};

export const isHamiMainChatsUrl = (url: string) => {
  try {
    const raw = url?.trim();
    if (!raw) return false;

    let origin: string | null = null;
    let pathname: string;

    if (raw.startsWith('/')) {
      origin = HAMI_ORIGIN;
      pathname = raw;
    } else {
      const candidate = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
      const parsed = new URL(candidate);
      origin = parsed.origin;
      pathname = parsed.pathname;
    }

    if (origin !== HAMI_ORIGIN) return false;

    const path = pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/chats') return true;
    if (/^\/chats\/[^/]+/i.test(path)) return false;
    if (/^\/chat\/[^/]+/i.test(path)) return false;
    if (/^\/stories(\/|$)/i.test(path)) return false;

    return false;
  } catch {
    return false;
  }
};

export const toHamiIframeSrc = (hamiPath: string) => {
  const normalized = hamiPath.startsWith('/') ? hamiPath : `/${hamiPath}`;
  return `${HAMI_ORIGIN}${normalized}`;
};
