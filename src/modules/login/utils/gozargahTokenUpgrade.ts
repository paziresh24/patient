import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const UPGRADE_URL = `${publicRuntimeConfig.API_GATEWAY_BASE_URL}/gozargah/v1/token/upgrade`;

let inflight: Promise<boolean> | null = null;
let lastAttemptAt = 0;
const MIN_RETRY_MS = 60_000;

/** @internal test-only */
export function resetGozargahTokenUpgradeStateForTests(): void {
  inflight = null;
  lastAttemptAt = 0;
}

/**
 * Silent refresh of httpOnly gozargah_token (RS256).
 * Fail-soft: never logs the user out.
 */
export async function upgradeGozargahTokenSilent(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const now = Date.now();
  if (inflight) return inflight;
  if (now - lastAttemptAt < MIN_RETRY_MS) return false;

  lastAttemptAt = now;
  inflight = (async () => {
    try {
      const response = await fetch(UPGRADE_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { accept: 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function scheduleGozargahTokenUpgrade(): void {
  void upgradeGozargahTokenSilent();
}
