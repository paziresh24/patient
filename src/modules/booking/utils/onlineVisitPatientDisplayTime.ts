import { digitsFaToEn } from '@persian-tools/persian-tools';
import moment from 'jalali-moment';
import { withApproxTimePrefix } from '@/modules/booking/utils/withApproxTimePrefix';

const TEHRAN_TZ = 'Asia/Tehran';

/** Patient-facing online-visit display: buy the doctor ~15 minutes, then ceil to a 5-minute clock. */
export const ONLINE_VISIT_PATIENT_TIME_BUFFER_MS = 15 * 60 * 1000;

const getTehranMinuteParts = (ms: number) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TEHRAN_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(ms));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value ?? 0);

  return { minute: read('minute'), second: read('second') };
};

export const applyOnlineVisitPatientDisplayBufferMs = (ms: number): number => {
  let t = ms + ONLINE_VISIT_PATIENT_TIME_BUFFER_MS;
  const { minute, second } = getTehranMinuteParts(t);
  const msInSecond = ((t % 1000) + 1000) % 1000;
  const onFiveMinuteMark = minute % 5 === 0 && second === 0 && msInSecond === 0;
  if (onFiveMinuteMark) return t;

  const rem = minute % 5;
  const minutesToAdd = rem === 0 ? 5 : 5 - rem;
  t = t - second * 1000 - msInSecond;
  return t + minutesToAdd * 60 * 1000;
};

const parseBookTimeToMs = (timeText: string): number | null => {
  const latin = digitsFaToEn(timeText).trim();
  let body = latin.replace(/^حدود\s+/, '').trim();
  body = body.replace(/^ساعت\s+/, '').trim();

  const dateThenClock = body.match(/^(\d{4}\/\d{2}\/\d{2})\s+(\d{1,2}:\d{2})$/);
  if (dateThenClock) {
    const parsed = moment.from(`${dateThenClock[1]} ${dateThenClock[2]}`, 'fa', 'JYYYY/JMM/JDD HH:mm');
    return parsed?.isValid() ? parsed.valueOf() : null;
  }

  const clockThenDate = body.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{4}\/\d{2}\/\d{2})$/);
  if (clockThenDate) {
    const parsed = moment.from(`${clockThenDate[2]} ${clockThenDate[1]}`, 'fa', 'JYYYY/JMM/JDD HH:mm');
    return parsed?.isValid() ? parsed.valueOf() : null;
  }

  const parsed = moment.from(body, 'fa', 'JYYYY/JMM/JDD HH:mm');
  return parsed?.isValid() ? parsed.valueOf() : null;
};

export type OnlineVisitPatientDisplayOptions = {
  /** When false/omitted, keep legacy «حدود» without +15/ceil-5 (flag off). */
  enabled?: boolean;
};

/** Receipt / my-appointments book_time strings → «حدود HH:mm - YYYY/MM/DD» with +15 then ceil-to-5 when enabled. */
export const formatOnlineVisitPatientBookTime = (
  timeText: string | null | undefined,
  options?: OnlineVisitPatientDisplayOptions,
): string => {
  if (timeText == null) return '';
  const trimmed = String(timeText).trim();
  if (!trimmed) return '';
  if (!options?.enabled) return withApproxTimePrefix(trimmed);

  const ms = parseBookTimeToMs(trimmed);
  if (ms == null) return withApproxTimePrefix(trimmed);

  const display = moment(applyOnlineVisitPatientDisplayBufferMs(ms)).locale('fa');
  return `حدود ${display.format('HH:mm')} - ${display.format('jYYYY/jMM/jDD')}`;
};
