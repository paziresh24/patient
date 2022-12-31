import { convertTimeStampToFormattedTime } from '@/common/utils/convertTimeStampToFormattedTime';
import { convertTimeStampToPersianDate } from '@/common/utils/convertTimeStampToPersianDate';
import { CenterType } from '@/modules/myTurn/types/centerType';

type Patient = {
  name: string;
  cell: string;
  nationalCode: string;
  selectServeis: string;
};
interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime?: string;
    trackingCode: string;
    centerName: string;
    centerPhone?: string;
    address?: string;
    centerId: string;
    patientInfo: Patient;
    rules?: string[];
  };
  centerType: CenterType;
}

export const turnDetailsData = ({ data, centerType }: TurnDetailsDataParam) => {
  const { bookTime, trackingCode, waitingTime, centerName, centerPhone, address, centerId, patientInfo, rules } = data;

  const dateTime = `${convertTimeStampToFormattedTime(bookTime)} - ${convertTimeStampToPersianDate(bookTime)}`;

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان تقریبی نوبت',
      value: dateTime,
      shouldShow: true,
      type: 'Text',
      isBoldValue: true,
    },
    {
      id: 2,
      name: 'توضیحات',
      value: 'زمان نوبت اعلام شده، برای حضور در مرکز درمانی بوده و با زمان ویزیت تفاوت دارد.',
      shouldShow: true,
      type: 'Label',
      isBoldValue: true,
    },
    {
      id: 3,
      name: ` میانگین زمان انتظار در ${centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'}`,
      value: waitingTime,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 4,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 5,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType === CenterType.hospital,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 6,
      name: 'تماس با مرکز درمانی',
      value: centerPhone,
      buttonAction: () => {
        return (location.href = 'tel:${centerPhone}');
      },
      shouldShow: !!centerPhone,
      type: 'Button',
    },
    {
      id: 7,
      name: 'آدرس مرکز',
      value: address,
      shouldShow: centerId !== '5532',
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 8,
      name: 'نام بیمار',
      value: patientInfo.name,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 9,
      name: 'شماره بیمار',
      value: patientInfo.cell,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 10,
      name: 'کدملی بیمار',
      value: patientInfo.nationalCode,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 11,
      name: 'سرویس انتخاب شده',
      value: patientInfo.selectServeis,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 12,
      name: 'قوانین',
      value: rules?.map((items, index) => ({
        id: index,
        name: items,
        type: 'Label',
      })),
      shouldShow: true,
      type: 'Accordion',
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
