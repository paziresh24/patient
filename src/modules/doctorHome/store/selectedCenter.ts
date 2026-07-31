import { create } from 'zustand';

export const DOCTOR_HOME_SELECTED_CENTER_KEY = 'p24-doctor-home-selected-center';

export const readPersistedSelectedCenterId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(DOCTOR_HOME_SELECTED_CENTER_KEY);
    if (!stored || stored === 'all') return null;
    return stored;
  } catch {
    return null;
  }
};

const persistSelectedCenterId = (centerId: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOCTOR_HOME_SELECTED_CENTER_KEY, centerId ?? 'all');
  } catch {
    // private mode / quota
  }
};

interface SelectedCenterStore {
  /** null = همه مراکز */
  selectedCenterId: string | null;
  setSelectedCenterId: (centerId: string | null) => void;
}

export const useSelectedCenterStore = create<SelectedCenterStore>(set => ({
  selectedCenterId: typeof window === 'undefined' ? null : readPersistedSelectedCenterId(),
  setSelectedCenterId: centerId => {
    persistSelectedCenterId(centerId);
    set({ selectedCenterId: centerId });
  },
}));

export const clearPersistedSelectedCenter = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DOCTOR_HOME_SELECTED_CENTER_KEY);
  } catch {
    // private mode
  }
  useSelectedCenterStore.setState({ selectedCenterId: null });
};
