import moment from 'jalali-moment';
import { create } from 'zustand';

interface SelectedDateStore {
  selectedDate: string; // Gregorian ISO: YYYY-MM-DD
  setSelectedDate: (date: string) => void;
}

export const useSelectedDateStore = create<SelectedDateStore>(set => ({
  selectedDate: moment().format('YYYY-MM-DD'),
  setSelectedDate: date => set({ selectedDate: date }),
}));
