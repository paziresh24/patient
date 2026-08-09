import { create } from 'zustand';

const STORAGE_KEY = 'doctor-home-wallet-balance-visible';

const readStoredVisibility = () => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== '0';
};

interface WalletBalanceVisibilityStore {
  isVisible: boolean;
  hydrated: boolean;
  toggle: () => void;
  hydrate: () => void;
}

export const useWalletBalanceVisibilityStore = create<WalletBalanceVisibilityStore>((set, get) => ({
  isVisible: true,
  hydrated: false,
  toggle: () => {
    const next = !get().isVisible;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    }
    set({ isVisible: next });
  },
  hydrate: () => set({ isVisible: readStoredVisibility(), hydrated: true }),
}));
