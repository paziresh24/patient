import { getCookie } from 'cookies-next';

const STORAGE_PREFIX = 'p24_pv_ms_';
const DEDUP_MS = 24 * 60 * 60 * 1000;

const storageKey = (profileApiId: string) => `${STORAGE_PREFIX}${profileApiId}`;

/** Soft client dedup (24h). Backend remains authoritative. */
export function hasRecentMicroservicePageView(profileApiId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.sessionStorage.getItem(storageKey(profileApiId));
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DEDUP_MS;
  } catch {
    return false;
  }
}

export function markMicroservicePageView(profileApiId: string) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(storageKey(profileApiId), String(Date.now()));
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Client → Next BFF → profiles-api POST …/statistics/page-views
 * Only for microservice (new backend) profiles.
 */
export async function recordMicroserviceProfilePageView(params: {
  profileApiId: string;
  viewerUserId?: string | number | null;
}): Promise<{ page_views?: number; counted?: boolean } | null> {
  const { profileApiId, viewerUserId } = params;
  if (!profileApiId) return null;
  if (hasRecentMicroservicePageView(profileApiId)) {
    return { counted: false };
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const terminalId = getCookie('terminal_id');
  if (terminalId) headers['X-Terminal-Id'] = String(terminalId);
  if (viewerUserId != null && String(viewerUserId)) {
    headers['X-Viewer-User-Id'] = String(viewerUserId);
  }

  const res = await fetch(`/api/profiles/${encodeURIComponent(profileApiId)}/page-views`, {
    method: 'POST',
    headers,
    credentials: 'same-origin',
  });

  if (!res.ok) {
    throw new Error(`page-views failed: ${res.status}`);
  }

  markMicroservicePageView(profileApiId);
  const json = await res.json().catch(() => null);
  return json?.data ?? null;
}
