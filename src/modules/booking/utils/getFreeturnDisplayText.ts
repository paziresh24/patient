import moment from 'jalali-moment';

export const getFreeturnDisplayText = (freeturnMs: number | null): string => {
  if (freeturnMs === null) return 'در اسرع وقت';
  if (freeturnMs < Date.now()) return 'در کمتر از ۱۵ دقیقه آینده';

  return moment(freeturnMs).locale('fa').calendar(undefined, {
    nextWeek: 'YYYY/MM/DD(dddd) حدود ساعت HH:mm',
    sameElse: 'YYYY/MM/DD حدود ساعت HH:mm',
    sameDay: 'امروز حدود ساعت HH:mm',
    nextDay: 'فردا حدود ساعت HH:mm',
  });
};
