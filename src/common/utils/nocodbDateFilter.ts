/** NocoDB DateTime فیلتر exactDate — مقادیر UTC بدون timezone suffix */

const TEHRAN_OFFSET_MS = 210 * 60 * 1000;

const formatNocoDbUtcDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
};

/** بازه UTC یک روز تقویمی تهران برای فیلتر NocoDB روی ستون DateTime */
export const getTehranDayUtcBounds = (isoDate: string): { from: string; to: string } => {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return { from: '', to: '' };

  const startUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - TEHRAN_OFFSET_MS);
  const endUtc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59) - TEHRAN_OFFSET_MS);

  return {
    from: formatNocoDbUtcDateTime(startUtc),
    to: formatNocoDbUtcDateTime(endUtc),
  };
};

export const buildNocoDbDateTimeRangeClauses = (
  field: string,
  from: string,
  to: string,
): string[] => {
  if (!from || !to) return [];
  return [`(${field},ge,exactDate,${from})`, `(${field},le,exactDate,${to})`];
};
