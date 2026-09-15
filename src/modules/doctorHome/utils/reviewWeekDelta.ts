import { getFeedbackCreatedAtValue, getFeedbackLocalDateKey } from '@/common/utils/formatRelativeFeedbackTime';

const TEHRAN_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran' });

export const tehranTodayKey = (now = new Date()) => TEHRAN_DATE.format(now);

export const addCalendarDays = (isoDate: string, delta: number): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + delta));
  return next.toISOString().slice(0, 10);
};

export const extractFeedbackList = (payload: unknown): Array<Record<string, unknown>> => {
  if (Array.isArray(payload)) return payload as Array<Record<string, unknown>>;
  if (!payload || typeof payload !== 'object') return [];
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.list)) return record.list as Array<Record<string, unknown>>;
  if (Array.isArray(record.data)) return record.data as Array<Record<string, unknown>>;
  return [];
};

const countInDays = (items: Array<Record<string, unknown>>, dayKeys: Set<string>): number => {
  let count = 0;
  for (const item of items) {
    const day = getFeedbackLocalDateKey(getFeedbackCreatedAtValue(item));
    if (day && dayKeys.has(day)) count += 1;
  }
  return count;
};

const weekKeys = (today: string, offsetWeeks: number): Set<string> => {
  const endOffset = -(offsetWeeks * 7);
  const startOffset = endOffset - 6;
  return new Set(Array.from({ length: 7 }, (_, index) => addCalendarDays(today, startOffset + index)));
};

/** درصد تغییر تعداد نظر این هفته نسبت به هفته قبل. */
export const buildReviewWeekDeltaPercent = (
  items: Array<Record<string, unknown>> | undefined,
  today = tehranTodayKey(),
): number | null => {
  const thisWeek = countInDays(items ?? [], weekKeys(today, 0));
  const lastWeek = countInDays(items ?? [], weekKeys(today, 1));
  if (lastWeek === 0) return null;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
};
