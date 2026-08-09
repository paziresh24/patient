import { create } from 'zustand';

interface SelectedCenterStore {
  /** null = همه مراکز */
  selectedCenterId: string | null;
  setSelectedCenterId: (centerId: string | null) => void;
}

export const useSelectedCenterStore = create<SelectedCenterStore>(set => ({
  selectedCenterId: null,
  setSelectedCenterId: centerId => set({ selectedCenterId: centerId }),
}));
