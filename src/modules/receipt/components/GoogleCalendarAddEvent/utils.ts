import { EMAIL_STORAGE_KEY, SUBMITTED_EVENTS_STORAGE_KEY } from './constants';

const MAX_EMAIL_LENGTH = 254;

export const isValidEmail = (email: string) =>
  email.length > 0 && email.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getEventStorageKey = (centerId: string, bookId: string) => `${centerId}:${bookId}`;

const readSubmittedEvents = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SUBMITTED_EVENTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([key, value]) => typeof key === 'string' && typeof value === 'string',
      ),
    ) as Record<string, string>;
  } catch {
    return {};
  }
};

export const getSubmittedEmail = (centerId: string, bookId: string) => {
  const storedEmail = readSubmittedEvents()[getEventStorageKey(centerId, bookId)]?.trim() ?? '';
  return isValidEmail(storedEmail) ? storedEmail : '';
};

export const saveSubmittedEmail = (centerId: string, bookId: string, email: string) => {
  const trimmedEmail = email.trim();
  if (!isValidEmail(trimmedEmail) || typeof window === 'undefined') {
    return;
  }

  try {
    const submittedEvents = readSubmittedEvents();
    submittedEvents[getEventStorageKey(centerId, bookId)] = trimmedEmail;
    window.localStorage.setItem(SUBMITTED_EVENTS_STORAGE_KEY, JSON.stringify(submittedEvents));
  } catch {
    // Ignore quota / private-mode errors; submitted state is a convenience only.
  }
};

export const getLastUsedEmail = (profileEmail?: string) => {
  if (typeof window === 'undefined') {
    return profileEmail?.trim() ?? '';
  }

  try {
    const storedEmail = window.localStorage.getItem(EMAIL_STORAGE_KEY)?.trim() ?? '';
    return storedEmail || profileEmail?.trim() || '';
  } catch {
    return profileEmail?.trim() || '';
  }
};

export const saveLastUsedEmail = (email: string) => {
  const trimmedEmail = email.trim();
  if (!isValidEmail(trimmedEmail) || typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(EMAIL_STORAGE_KEY, trimmedEmail);
  } catch {
    // Ignore quota / private-mode errors; email prefill is a convenience only.
  }
};
