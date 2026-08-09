import { create } from 'zustand';

/**
 * In-memory only (not sessionStorage): survives SPA navigation, cleared on full refresh.
 * Lets mobile doctors soft-switch to patient home without bounce;
 * refresh/direct visit on mobile still redirects to /_/.
 */
interface SpaPatientViewStore {
  active: boolean;
  mark: () => void;
  clear: () => void;
}

export const useSpaPatientViewStore = create<SpaPatientViewStore>(set => ({
  active: false,
  mark: () => set({ active: true }),
  clear: () => set({ active: false }),
}));

export const isSpaPatientView = () => useSpaPatientViewStore.getState().active;

export const markSpaPatientView = () => {
  useSpaPatientViewStore.getState().mark();
};

export const clearSpaPatientView = () => {
  useSpaPatientViewStore.getState().clear();
};
