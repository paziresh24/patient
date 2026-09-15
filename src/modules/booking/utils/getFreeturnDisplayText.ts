import { applyOnlineVisitPatientDisplayBufferMs } from '@/modules/booking/utils/onlineVisitPatientDisplayTime';
import moment from 'jalali-moment';

export type FreeturnDisplayOptions = {
  /** When true, apply +15 then ceil-to-5 (same as profile new_onlinevisit_box). */
  enabled?: boolean;
};

export const getFreeturnDisplayText = (
  freeturnMs: number | null,
  options?: FreeturnDisplayOptions,
): string => {
  if (freeturnMs === null) return 'در اسرع وقت';
  if (freeturnMs < Date.now()) return 'در کمتر از ۱۵ دقیقه آینده';

  const displayMs = options?.enabled ? applyOnlineVisitPatientDisplayBufferMs(freeturnMs) : freeturnMs;

  return moment(displayMs).locale('fa').calendar(undefined, {
    nextWeek: 'YYYY/MM/DD(dddd) حدود ساعت HH:mm',
    sameElse: 'YYYY/MM/DD حدود ساعت HH:mm',
    sameDay: 'امروز حدود ساعت HH:mm',
    nextDay: 'فردا حدود ساعت HH:mm',
  });
};
