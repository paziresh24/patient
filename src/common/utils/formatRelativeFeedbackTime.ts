/** Unix timestamps from Ravi API are in seconds; `Date` expects milliseconds. */
export const parseFeedbackCreatedAt = (value: string | number | null | undefined): Date | null => {
  if (value == null || value === '') return null;

  const trimmed = typeof value === 'string' ? value.trim() : value;
  if (trimmed === '') return null;

  if (typeof trimmed === 'number' || /^-?\d+(\.\d+)?$/.test(String(trimmed))) {
    const numeric = Math.floor(Number(trimmed));
    if (!Number.isFinite(numeric)) return null;
    const ms = numeric < 1e12 ? numeric * 1000 : numeric;
    const parsed = new Date(ms);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const normalized = String(trimmed).replace(/^(\d{4}-\d{2}-\d{2})\s+/, '$1T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const TEHRAN_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran' });
const TEHRAN_TIME_FORMATTER = new Intl.DateTimeFormat('fa-IR', {
  timeZone: 'Asia/Tehran',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** تاریخ میلادی روز ثبت نظر در منطقه زمانی تهران (YYYY-MM-DD) */
export const getFeedbackLocalDateKey = (
  value: string | number | null | undefined,
): string | null => {
  const created = parseFeedbackCreatedAt(value);
  if (!created) return null;
  return TEHRAN_DATE_FORMATTER.format(created);
};

export const formatFeedbackLocalTime = (
  value: string | number | null | undefined,
): string | undefined => {
  const created = parseFeedbackCreatedAt(value);
  if (!created) return undefined;
  return TEHRAN_TIME_FORMATTER.format(created);
};

export const getFeedbackCreatedAtValue = (
  item: Record<string, unknown> | null | undefined,
): string | number | null | undefined => {
  if (!item) return undefined;

  const createdAt =
    item.created_at ?? item.Created_at ?? item.createdAt ?? item.CreatedAt ?? null;

  if (createdAt != null && createdAt !== '') return createdAt as string | number;

  // Ravi API sometimes returns created_at=null; default_order holds unix seconds for sorting.
  return (item.default_order ?? item.Default_order ?? item.updated_at ?? item.Updated_at) as
    | string
    | number
    | null
    | undefined;
};

const numToPersian = (num: number): string => {
  const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];

  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return `${tens[ten]}${unit > 0 ? ` و ${units[unit]}` : ''}`;
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return `${units[hundred]}صد${remainder > 0 ? ` و ${numToPersian(remainder)}` : ''}`;
  }

  return String(num);
};

export const formatRelativeFeedbackTime = (
  value: string | number | null | undefined,
): string | undefined => {
  const createdDate = parseFeedbackCreatedAt(value);
  if (!createdDate) return undefined;

  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  const numbers = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده'];

  if (daysDiff === 0) return 'امروز';
  if (daysDiff === 1) return 'دیروز';
  if (daysDiff < 7) return `${numbers[daysDiff]} روز پیش`;

  if (daysDiff < 30) {
    const weeksDiff = Math.floor(daysDiff / 7);
    if (weeksDiff === 1) return 'یک هفته پیش';
    return `${numbers[weeksDiff]} هفته پیش`;
  }

  if (daysDiff < 365) {
    const monthsDiff = Math.floor(daysDiff / 30);
    if (monthsDiff === 1) return 'یک ماه پیش';
    return `${numToPersian(monthsDiff)} ماه پیش`;
  }

  const yearsDiff = Math.floor(daysDiff / 365);
  if (yearsDiff === 1) return 'یک سال پیش';
  if (yearsDiff === 2) return 'دو سال پیش';
  return `${numToPersian(yearsDiff)} سال پیش`;
};

export const enrichReviewResponseWithRelativeTime = <T extends Record<string, unknown>>(
  items: T[] | null | undefined,
): Array<T & { relativeCreatedTime?: string }> => {
  if (!items?.length) return [];

  return items.map(item => ({
    ...item,
    relativeCreatedTime: formatRelativeFeedbackTime(getFeedbackCreatedAtValue(item)),
  }));
};

export const formatFeedbackLocaleDate = (
  value: string | number | null | undefined,
  locale = 'fa-IR',
): string | undefined => {
  const createdDate = parseFeedbackCreatedAt(value);
  if (!createdDate) return undefined;
  return createdDate.toLocaleDateString(locale);
};
