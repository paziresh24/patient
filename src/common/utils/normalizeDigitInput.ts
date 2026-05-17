import { digitsFaToEn } from '@persian-tools/persian-tools';

/** Converts Persian/Arabic digits to English and keeps digits only. */
export const normalizeDigitInput = (value: string, maxLength?: number): string => {
  const normalized = digitsFaToEn(value).replace(/\D/g, '');
  return maxLength !== undefined ? normalized.slice(0, maxLength) : normalized;
};

export const normalizeNationalCodeInput = (value: string): string => normalizeDigitInput(value, 10);
