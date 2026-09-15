import { create } from 'zustand';

const STORAGE_KEY = 'doctor-home-growth-path-expanded';

/** Expanded unless the doctor previously collapsed it. */
const readStoredExpanded = () => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) !== '0';
};

interface GrowthPathExpandedStore {
  isExpanded: boolean;
  hydrated: boolean;
  toggle: () => void;
  hydrate: () => void;
}

export const useGrowthPathExpandedStore = create<GrowthPathExpandedStore>((set, get) => ({
  isExpanded: true,
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
