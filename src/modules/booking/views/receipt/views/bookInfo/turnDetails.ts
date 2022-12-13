import { convertTimeStampToFormattedTime } from '@/common/utils/convertTimeStampToFormattedTime';
import { convertTimeStampToPersianDate } from '@/common/utils/convertTimeStampToPersianDate';
import { CenterType } from '@/modules/myTurn/types/centerType';

interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime: string;
    trackingCode: string;
    centerName: string;
    address?: string;
    patientName: string;
    centerId: string;
    centerPhone: string;
  };
  centerType: CenterType;
}

export const turnDetailsData = ({ data, centerType }: TurnDetailsDataParam) => {
  const { bookTime, trackingCode, waitingTime, centerName, patientName, address, centerId, centerPhone } = data;

  const dateTime = `${convertTimeStampToFormattedTime(bookTime)} - ${convertTimeStampToPersianDate(bookTime)}`;

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان تقریبی نوبت',
      value: dateTime,
      shouldShow: true,
      type: 'String',
    },
    {
      id: 5,
      name: `میانگین زمان انتظار در ${centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'}`,
      value: waitingTime,
      shouldShow: true,
      type: 'String',
    },
    {
      id: 2,
      name: 'مراجعه کننده',
      value: patientName,
      shouldShow: true,
      type: 'String',
    },
    {
      id: 3,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: true,
      type: 'String',
    },
    {
      id: 4,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType === CenterType.hospital,
      type: 'String',
    },
    {
      id: 5,
      name: 'تماس با مرکز درمانی',
      value: centerPhone,
      buttonAction: () => {
        return (location.href = `tel:${centerPhone}`);
      },
      shouldShow: !!centerPhone,
      type: 'Button',
    },
    {
      id: 6,
      name: 'آدرس مرکز',
      value: address,
      shouldShow: centerId !== '5532',
      type: 'String',
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
