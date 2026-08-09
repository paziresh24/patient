import { create } from 'zustand';

export type DoctorViewMode = 'doctor' | 'patient';

export const DOCTOR_VIEW_MODE_STORAGE_KEY = 'doctor-home-view-mode';

const readStoredMode = (): DoctorViewMode => {
  if (typeof window === 'undefined') return 'doctor';
  const stored = sessionStorage.getItem(DOCTOR_VIEW_MODE_STORAGE_KEY);
  return stored === 'patient' ? 'patient' : 'doctor';
};

export const isPatientViewModeStored = (): boolean =>
  typeof window !== 'undefined' && sessionStorage.getItem(DOCTOR_VIEW_MODE_STORAGE_KEY) === 'patient';

interface DoctorViewModeStore {
  mode: DoctorViewMode;
  setMode: (mode: DoctorViewMode) => void;
  hydrate: () => void;
}

export const useDoctorViewModeStore = create<DoctorViewModeStore>(set => ({
  mode: 'doctor',
  setMode: mode => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(DOCTOR_VIEW_MODE_STORAGE_KEY, mode);
    }
    set({ mode });
  },
  hydrate: () => set({ mode: readStoredMode() }),
}));

export { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
