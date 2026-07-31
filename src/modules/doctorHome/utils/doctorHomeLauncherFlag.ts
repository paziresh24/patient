export const DOCTOR_HOME_LAUNCHER_FLAG_KEY = 'p24-doctor-home-launcher-flag-v1';
export const DOCTOR_HOME_LAUNCHER_FLAG_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type DoctorHomeLauncherFlagV1 = {
  version: 1;
  userId: string;
  enabled: boolean;
  savedAt: number;
};

export function readPersistedLauncherFlag(userId: string): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DoctorHomeLauncherFlagV1>;
    if (parsed?.version !== 1 || typeof parsed.userId !== 'string' || typeof parsed.enabled !== 'boolean') {
      localStorage.removeItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY);
      return null;
    }
    if (typeof parsed.savedAt !== 'number' || Date.now() - parsed.savedAt > DOCTOR_HOME_LAUNCHER_FLAG_TTL_MS) {
      localStorage.removeItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY);
      return null;
    }
    if (parsed.userId !== userId) {
      return null;
    }
    return parsed.enabled;
  } catch {
    try {
      localStorage.removeItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY);
    } catch {
      // private mode
    }
    return null;
  }
}

export function writePersistedLauncherFlag(userId: string, enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (!userId) return;
    const payload: DoctorHomeLauncherFlagV1 = {
      version: 1,
      userId: String(userId),
      enabled: Boolean(enabled),
      savedAt: Date.now(),
    };
    localStorage.setItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY, JSON.stringify(payload));
  } catch {
    // private mode / quota
  }
}

export function clearPersistedLauncherFlag(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DOCTOR_HOME_LAUNCHER_FLAG_KEY);
  } catch {
    // private mode
  }
}

/**
 * Fast-path hydrate for skipping loading / showing new doctor home.
 * Only trusts persisted `enabled: true`. Sticky `false` from buggy builds is cleared.
 */
export function readTrustedEnabledLauncherFlag(userId: string): true | null {
  const enabled = readPersistedLauncherFlag(userId);
  if (enabled === true) return true;
  if (enabled === false) {
    clearPersistedLauncherFlag();
  }
  return null;
}
