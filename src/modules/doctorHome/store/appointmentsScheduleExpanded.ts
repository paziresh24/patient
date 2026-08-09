import { create } from 'zustand';

const STORAGE_KEY = 'doctor-home-appointments-schedule-expanded';

const readStoredExpanded = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === '1';
};

interface AppointmentsScheduleExpandedStore {
  isExpanded: boolean;
  hydrated: boolean;
  toggle: () => void;
  hydrate: () => void;
}

export const useAppointmentsScheduleExpandedStore = create<AppointmentsScheduleExpandedStore>((set, get) => ({
  isExpanded: false,
  hydrated: false,
  toggle: () => {
    const next = !get().isExpanded;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    }
    set({ isExpanded: next });
  },
  hydrate: () => set({ isExpanded: readStoredExpanded(), hydrated: true }),
}));
