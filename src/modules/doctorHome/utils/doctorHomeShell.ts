import type { UserInfo } from '@/modules/login/store/userInfo';

export type DoctorHomeShellV1 = {
  version: 1;
  userId: string;
  savedAt: number;
  provider: {
    job_title: 'doctor';
    slug?: string;
    centers: unknown[];
  };
};

export const DOCTOR_HOME_SHELL_KEY = 'p24-doctor-home-shell-v1';
export const DOCTOR_HOME_SHELL_TTL_MS = 24 * 60 * 60 * 1000;

export function readDoctorHomeShell(): DoctorHomeShellV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DOCTOR_HOME_SHELL_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DoctorHomeShellV1>;
    if (parsed?.version !== 1) {
      localStorage.removeItem(DOCTOR_HOME_SHELL_KEY);
      return null;
    }
    if (!parsed.userId || typeof parsed.userId !== 'string') {
      localStorage.removeItem(DOCTOR_HOME_SHELL_KEY);
      return null;
    }
    if (typeof parsed.savedAt !== 'number' || Date.now() - parsed.savedAt > DOCTOR_HOME_SHELL_TTL_MS) {
      localStorage.removeItem(DOCTOR_HOME_SHELL_KEY);
      return null;
    }
    const provider = parsed.provider;
    if (!provider || !Array.isArray(provider.centers) || provider.centers.length === 0) {
      localStorage.removeItem(DOCTOR_HOME_SHELL_KEY);
      return null;
    }

    return {
      version: 1,
      userId: parsed.userId,
      savedAt: parsed.savedAt,
      provider: {
        job_title: 'doctor',
        ...(provider.slug ? { slug: provider.slug } : {}),
        centers: provider.centers,
      },
    };
  } catch {
    try {
      localStorage.removeItem(DOCTOR_HOME_SHELL_KEY);
    } catch {
      // private mode
    }
    return null;
  }
}

export function writeDoctorHomeShell(
  input: Omit<DoctorHomeShellV1, 'version' | 'savedAt'> & { savedAt?: number },
): void {
  if (typeof window === 'undefined') return;
  try {
    if (!input.userId || !Array.isArray(input.provider?.centers) || input.provider.centers.length === 0) {
      return;
    }
    const payload: DoctorHomeShellV1 = {
      version: 1,
      userId: String(input.userId),
      savedAt: input.savedAt ?? Date.now(),
      provider: {
        job_title: 'doctor',
        ...(input.provider.slug ? { slug: input.provider.slug } : {}),
        centers: input.provider.centers,
      },
    };
    localStorage.setItem(DOCTOR_HOME_SHELL_KEY, JSON.stringify(payload));
  } catch {
    // private mode / quota
  }
}

export function clearDoctorHomeShell(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DOCTOR_HOME_SHELL_KEY);
  } catch {
    // private mode
  }
}

export function shellToUserInfoPatch(shell: DoctorHomeShellV1): Partial<UserInfo> {
  return {
    id: shell.userId,
    is_doctor: true,
    provider: {
      job_title: 'doctor',
      ...(shell.provider.slug ? { slug: shell.provider.slug } : {}),
      centers: shell.provider.centers as any[],
    },
  };
}
