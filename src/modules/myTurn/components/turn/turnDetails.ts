import { convertTimeStampToFormattedTime } from '@/common/utils/convertTimeStampToFormattedTime';
import { convertTimeStampToPersianDate } from '@/common/utils/convertTimeStampToPersianDate';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PAYMENT_STATUS_TRANSLATION } from '../../constants/paymentStatusTranslation';
import { PaymentStatus } from '../../types/paymentStatus';

interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime?: string;
    trackingCode: string;
    centerName: string;
    patientName: string;
  };
  status: BookStatus;
  paymentStatus: PaymentStatus;
  activePaymentStatus: Boolean;
  centerType: CenterType;
}

export const turnDetailsData = ({ data, status, centerType, paymentStatus, activePaymentStatus }: TurnDetailsDataParam) => {
  const { bookTime, trackingCode, waitingTime, centerName, patientName } = data;

  const dateTime = `${convertTimeStampToFormattedTime(bookTime)} - ${convertTimeStampToPersianDate(bookTime)}`;

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان نوبت',
      value: dateTime,
      shouldShow: [BookStatus.visited, BookStatus.notVisited, BookStatus.expired, BookStatus.deleted].includes(status),
    },
    {
      id: 2,
      name: 'مراجعه کننده',
      value: patientName,
      shouldShow: [
        BookStatus.visited,
        BookStatus.notVisited,
        BookStatus.expired,
        BookStatus.requested,
        BookStatus.rejected,
        BookStatus.deleted,
      ].includes(status),
    },
    {
      id: 3,
      name: 'وضعیت پرداخت',
      value: PAYMENT_STATUS_TRANSLATION[paymentStatus],
      shouldShow: activePaymentStatus,
    },
    {
      id: 4,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: [
        BookStatus.visited,
        BookStatus.notVisited,
        BookStatus.expired,
        BookStatus.requested,
        BookStatus.rejected,
        BookStatus.deleted,
      ].includes(status),
    },
    {
      id: 5,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType === CenterType.hospital,
    },
    {
      id: 6,
      name: `میانگین زمان انتظار در ${centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'}`,
      value: waitingTime,
      shouldShow:
        [BookStatus.visited, BookStatus.notVisited, BookStatus.expired, BookStatus.deleted].includes(status) &&
        centerType !== CenterType.consult,
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
