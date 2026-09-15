import moment from 'jalali-moment';

/**
 * Compute years of experience from a graduation year/date string.
 * Iranian profile APIs usually store Jalali years (e.g. 1390);
 * Gregorian years are typically >= 1700.
 */
export function computeExperienceYearsFromGraduationDate(
  graduationDate: string | null | undefined,
): string | null {
  if (!graduationDate) return null;
  const year = parseInt(String(graduationDate).slice(0, 4), 10);
  if (Number.isNaN(year)) return null;

  const useJalali = year < 1700;
  const currentYear = useJalali
    ? Number(moment().format('jYYYY'))
    : new Date().getFullYear();

  if (Number.isNaN(currentYear)) return null;
  const years = currentYear - year;
  return years >= 0 ? String(years) : null;
}
