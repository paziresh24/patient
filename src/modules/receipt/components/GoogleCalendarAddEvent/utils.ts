import { EMAIL_STORAGE_KEY } from './constants';

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
