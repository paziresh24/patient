import { create } from 'zustand';

export type DoctorViewMode = 'doctor' | 'patient';

const STORAGE_KEY = 'doctor-home-view-mode';

const readStoredMode = (): DoctorViewMode => {
  if (typeof window === 'undefined') return 'doctor';
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored === 'patient' ? 'patient' : 'doctor';
};

interface DoctorViewModeStore {
  mode: DoctorViewMode;
  setMode: (mode: DoctorViewMode) => void;
  hydrate: () => void;
}

export const useDoctorViewModeStore = create<DoctorViewModeStore>(set => ({
  mode: 'doctor',
  setMode: mode => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, mode);
    }
    set({ mode });
  },
  hydrate: () => set({ mode: readStoredMode() }),
}));

export const isDoctorUser = (user?: { is_doctor?: boolean; provider?: { job_title?: string | null } }) =>
  !!user?.is_doctor && user?.provider?.job_title === 'doctor';
