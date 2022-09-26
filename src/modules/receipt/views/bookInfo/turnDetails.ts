import { convertTimeStampToFormattedTime } from '@/common/utils/convertTimeStampToFormattedTime';
import { convertTimeStampToPersianDate } from '@/common/utils/convertTimeStampToPersianDate';
import { CenterType } from '@/modules/myTurn/types/centerType';

interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime?: string;
    trackingCode: string;
    centerName: string;
    patientName: string;
  };
  centerType: CenterType;
}

export const turnDetailsData = ({ data, centerType }: TurnDetailsDataParam) => {
  const { bookTime, trackingCode, waitingTime, centerName, patientName } = data;

  const dateTime = `${convertTimeStampToFormattedTime(bookTime)} - ${convertTimeStampToPersianDate(bookTime)}`;

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان تقریبی نوبت',
      value: dateTime,
      shouldShow: true,
    },
    {
      id: 5,
      name: `میانگین زمان انتظار در ${centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'}`,
      value: waitingTime,
      shouldShow: true,
    },
    {
      id: 2,
      name: 'مراجعه کننده',
      value: patientName,
      shouldShow: true,
    },
    {
      id: 3,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: true,
    },
    {
      id: 4,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType === CenterType.hospital,
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
