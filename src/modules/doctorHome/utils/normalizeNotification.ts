import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import moment from 'jalali-moment';
import { DoctorHomeFeedAlert } from '../types/feed';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export const toEnglishDigits = (value: string) =>
  value.replace(/[۰-۹]/g, digit => String(PERSIAN_DIGITS.indexOf(digit)));

const cleanText = (value?: string) => removeHtmlTagInString(value ?? '').replace(/\s+/g, ' ').trim();

const extractJalaliDateKey = (text: string): string | null => {
  const match = text.match(/[۰-۹0-9]{4}\/[۰-۹0-9]{1,2}\/[۰-۹0-9]{1,2}/);
  if (!match) return null;

  const normalized = toEnglishDigits(match[0]);
  const parsed = moment(normalized, 'jYYYY/jM/jD', true);
  return parsed.isValid() ? parsed.format('jYYYY/jM/jD') : normalized;
};

export const getNotificationDateKey = (notification: DoctorHomeFeedAlert): string => {
  const fromText = extractJalaliDateKey(`${notification.title ?? ''} ${notification.description ?? ''}`);
  if (fromText) return fromText;

  if (notification.created_at) {
    const parsed = moment(notification.created_at);
    if (parsed.isValid()) return parsed.format('jYYYY/jM/jD');
  }

  return 'unknown';
};

export const formatNotificationDateLabel = (dateKey: string) => {
  if (dateKey === 'unknown') return 'اخیر';

  const parsed = moment(toEnglishDigits(dateKey), 'jYYYY/jM/jD', true);
  if (!parsed.isValid()) return dateKey;

  const today = moment();
  if (parsed.isSame(today, 'day')) return 'امروز';
  if (parsed.isSame(today.clone().subtract(1, 'day'), 'day')) return 'دیروز';

  return parsed.clone().locale('fa').format('jD jMMMM jYYYY');
};

export const getNotificationHeadline = (notification: DoctorHomeFeedAlert): string => {
  const title = cleanText(notification.title);
  if (!title) return 'اعلان جدید';

  const subscriptionMatch = title.match(/اشتراک\s+(.+?)\s+شما/i);
  if (subscriptionMatch?.[1]) {
    return `پایان اشتراک ${subscriptionMatch[1].trim()}`;
  }

  const withoutPrefix = title.replace(/^به اطلاع می‌رساند\s*/i, '').trim();
  if (withoutPrefix.length <= 72) return withoutPrefix;

  return `${withoutPrefix.slice(0, 69)}…`;
};

export const getNotificationPreview = (notification: DoctorHomeFeedAlert): string | undefined => {
  const title = cleanText(notification.title);
  const description = cleanText(notification.description);
  const headline = getNotificationHeadline(notification);

  if (description && description !== title) return description;
  if (title && title !== headline) return title;

  return undefined;
};

export const getNotificationFullText = (notification: DoctorHomeFeedAlert): string => {
  const title = cleanText(notification.title);
  const description = cleanText(notification.description);

  if (title && description && description !== title) {
    return `${title}\n\n${description}`;
  }

  return title || description || '';
};

export const getSelectedJalaliDateKey = (selectedDate: string) =>
  moment(selectedDate, 'YYYY-MM-DD').format('jYYYY/jM/jD');

export const filterNotificationsBySelectedDate = (
  items: DoctorHomeFeedAlert[],
  selectedDate: string,
) => {
  const targetKey = getSelectedJalaliDateKey(selectedDate);

  return items.filter(item => getNotificationDateKey(item) === targetKey);
};

export const getNotificationGregorianDateSet = (items: DoctorHomeFeedAlert[]): Set<string> => {
  const dates = new Set<string>();

  items.forEach(item => {
    const jalaliKey = getNotificationDateKey(item);
    if (jalaliKey === 'unknown') return;

    const parsed = moment(toEnglishDigits(jalaliKey), 'jYYYY/jM/jD', true);
    if (parsed.isValid()) {
      dates.add(parsed.format('YYYY-MM-DD'));
    }
  });

  return dates;
};

export const formatSelectedDateLabel = (selectedDate: string) => {
  const selected = moment(selectedDate, 'YYYY-MM-DD');
  const today = moment();

  if (selected.isSame(today, 'day')) return 'امروز';
  if (selected.isSame(today.clone().subtract(1, 'day'), 'day')) return 'دیروز';

  return selected.clone().locale('fa').format('jD jMMMM jYYYY');
};

export const groupNotificationsByDate = (items: DoctorHomeFeedAlert[]) => {
  const groups = new Map<string, DoctorHomeFeedAlert[]>();

  items.forEach(item => {
    const key = getNotificationDateKey(item);
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).sort(([left], [right]) => {
    if (left === 'unknown') return 1;
    if (right === 'unknown') return -1;

    const leftDate = moment(toEnglishDigits(left), 'jYYYY/jM/jD', true);
    const rightDate = moment(toEnglishDigits(right), 'jYYYY/jM/jD', true);

    if (!leftDate.isValid() || !rightDate.isValid()) return 0;
    return rightDate.valueOf() - leftDate.valueOf();
  });
};
