const TEHRAN_TZ = 'Asia/Tehran';

type TehranClock = {
  hour: number;
  minute: number;
  second: number;
};

type RoundedClock = {
  hour: number;
  minute: 0 | 15 | 30 | 45;
};

export const getTehranClock = (ms: number): TehranClock => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TEHRAN_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(ms));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value ?? 0);

  return {
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
};

export const roundUpToQuarterHourTehran = (ms: number): RoundedClock => {
  const { hour, minute, second } = getTehranClock(ms);
  const hasRemainder = second > 0 || ms % 1000 !== 0;
  const onQuarter = minute % 15 === 0 && !hasRemainder;

  if (onQuarter) return { hour, minute: minute as RoundedClock['minute'] };
  if (minute < 15) return { hour, minute: 15 };
  if (minute < 30) return { hour, minute: 30 };
  if (minute < 45) return { hour, minute: 45 };

  return { hour: (hour + 1) % 24, minute: 0 };
};

export const timeOfDayLabelFa = (hour: number): 'صبح' | 'ظهر' | 'عصر' | 'شب' => {
  if (hour >= 5 && hour < 12) return 'صبح';
  if (hour >= 12 && hour < 16) return 'ظهر';
  if (hour >= 16 && hour < 20) return 'عصر';
  return 'شب';
};

const toLatinDigits = (value: string): string =>
  value
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - '۰'.charCodeAt(0)))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - '٠'.charCodeAt(0)));

export const tehranGregorianDateKey = (ms: number): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TEHRAN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(ms));

  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value ?? '';
  return `${read('year')}-${read('month')}-${read('day')}`;
};

export const isSameTehranCalendarDay = (leftMs: number, rightMs: number): boolean =>
  tehranGregorianDateKey(leftMs) === tehranGregorianDateKey(rightMs);

export const formatJalaliDayMonthFa = (ms: number): string => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    timeZone: TEHRAN_TZ,
    day: 'numeric',
    month: 'long',
  }).formatToParts(new Date(ms));

  const day = toLatinDigits(parts.find(part => part.type === 'day')?.value ?? '');
  const month = parts.find(part => part.type === 'month')?.value ?? '';
  return `${day} ${month}ماه`;
};

export const formatRoundedOnlineVisitClock = (ms: number): string => {
  const { hour, minute } = roundUpToQuarterHourTehran(ms);
  const clock = minute === 0 ? String(hour) : `${hour}:${String(minute).padStart(2, '0')}`;
  return `حدود ساعت ${clock} ${timeOfDayLabelFa(hour)}`;
};

export const todayOrTonightLabelFa = (hour: number): 'امروز' | 'امشب' =>
  timeOfDayLabelFa(hour) === 'شب' ? 'امشب' : 'امروز';

export const ONLINE_VISIT_CTA_BASE = 'شروع ویزیت آنلاین';

export const buildOnlineVisitCtaText = (freeturnMs: number | null, nowMs = Date.now()): string => {
  if (freeturnMs == null) return ONLINE_VISIT_CTA_BASE;

  const sourceMs = freeturnMs < nowMs ? nowMs : freeturnMs;
  const timeText = formatRoundedOnlineVisitClock(sourceMs);
  if (isSameTehranCalendarDay(sourceMs, nowMs)) {
    return `${ONLINE_VISIT_CTA_BASE} ${timeText} ${todayOrTonightLabelFa(roundUpToQuarterHourTehran(sourceMs).hour)}`;
  }

  return `${ONLINE_VISIT_CTA_BASE} ${timeText} ${formatJalaliDayMonthFa(sourceMs)}`;
};

export const onlineVisitCtaButtonProps = (
  freeturnMs: number | null,
  nowMs = Date.now(),
): { children2: string } | undefined => {
  if (freeturnMs == null) return undefined;
  return { children2: buildOnlineVisitCtaText(freeturnMs, nowMs) };
};

