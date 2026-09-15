import moment from 'jalali-moment';

export type DoctorPanelUrlParams = {
  userId?: string | number | null;
  centerId?: string | null;
  /** تاریخ میلادی YYYY-MM-DD */
  date?: string;
  bookId?: string | null;
};

/** تاریخ شمسی برای پنل پزشکان، مثال: 1405-04-19 */
export const toJalaliPanelDate = (gregorianDate: string): string =>
  moment(gregorianDate, 'YYYY-MM-DD').format('jYYYY-jMM-jDD');

export const buildDoctorPanelUrl = (baseUrl: string, params: DoctorPanelUrlParams = {}): string => {
  try {
    const parsed = new URL(baseUrl);

    if (params.userId != null && params.userId !== '') {
      parsed.searchParams.set('user_id', String(params.userId));
    }
    if (params.centerId) {
      parsed.searchParams.set('center_id', params.centerId);
    }
    if (params.date) {
      parsed.searchParams.set('date', toJalaliPanelDate(params.date));
    }
    if (params.bookId) {
      parsed.searchParams.set('book_id', params.bookId);
    }

    return parsed.toString();
  } catch {
    return baseUrl;
  }
};

export const appendUserIdToUrl = (url: string, userId?: string | number | null): string =>
  buildDoctorPanelUrl(url, { userId });
