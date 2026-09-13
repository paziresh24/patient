import moment from 'jalali-moment';
import { create } from 'zustand';

export const DOCTOR_HOME_SELECTED_DATE_KEY = 'p24-doctor-home-selected-date';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DATE_DRIFT_DAYS = 14;

const todayGregorian = () => moment().format('YYYY-MM-DD');

const isWithinDriftWindow = (date: string, today: string) => {
  const stored = moment(date, 'YYYY-MM-DD', true);
  const now = moment(today, 'YYYY-MM-DD', true);
  if (!stored.isValid() || !now.isValid()) return false;
  return Math.abs(now.diff(stored, 'days')) <= MAX_DATE_DRIFT_DAYS;
};

export const readPersistedSelectedDate = (): string => {
  const today = todayGregorian();
  if (typeof window === 'undefined') return today;
  try {
    const stored = localStorage.getItem(DOCTOR_HOME_SELECTED_DATE_KEY);
    if (!stored || !DATE_RE.test(stored)) return today;
    if (!isWithinDriftWindow(stored, today)) {
      localStorage.setItem(DOCTOR_HOME_SELECTED_DATE_KEY, today);
      return today;
    }
    return stored;
  } catch {
    return today;
  }
};

const persistSelectedDate = (date: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOCTOR_HOME_SELECTED_DATE_KEY, date);
  } catch {
    // private mode / quota
  }
};

interface SelectedDateStore {
  selectedDate: string; // Gregorian ISO: YYYY-MM-DD
  setSelectedDate: (date: string) => void;
}

export const useSelectedDateStore = create<SelectedDateStore>(set => ({
  selectedDate: typeof window === 'undefined' ? todayGregorian() : readPersistedSelectedDate(),
  setSelectedDate: date => {
    persistSelectedDate(date);
    set({ selectedDate: date });
  },
}));

export const clearPersistedSelectedDate = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DOCTOR_HOME_SELECTED_DATE_KEY);
  } catch {
    // private mode
  }
  useSelectedDateStore.setState({ selectedDate: todayGregorian() });
};
