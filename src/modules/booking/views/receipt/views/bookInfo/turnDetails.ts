import { convertTimeStampToFormattedTime } from '@/common/utils/convertTimeStampToFormattedTime';
import { convertTimeStampToPersianDate } from '@/common/utils/convertTimeStampToPersianDate';
import { CenterType } from '@/modules/myTurn/types/centerType';

type Patient = {
  name: string;
  nationalCode: string;
  cell: string;
  selectServeis: string;
};

interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime: string;
    trackingCode: string;
    centerName: string;
    address?: string;
    centerId: string;
    centerPhone: string;
    patientInfo: Patient;
    rules?: Array<string>;
  };
  centerType: CenterType;
}

export const turnDetailsData = ({
  data,
  centerType,
}: TurnDetailsDataParam): {
  id: number;
  name: string;
  value?: string | { name: string; value?: string; id: number }[];
  type: string;
  buttonAction?: () => void;
  shouldShow: boolean;
}[] => {
  const { bookTime, trackingCode, waitingTime, centerName, address, centerId, centerPhone, patientInfo, rules } = data;

  const dateTime = `${convertTimeStampToFormattedTime(bookTime)} - ${convertTimeStampToPersianDate(bookTime)}`;

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان تقریبی نوبت',
      value: dateTime,
      shouldShow: true,
      type: 'Text',
    },
    {
      id: 5,
      name: `میانگین زمان انتظار در ${centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'}`,
      value: waitingTime,
      shouldShow: true,
      type: 'Text',
    },
    {
      id: 3,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: true,
      type: 'Text',
    },
    {
      id: 4,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType === CenterType.hospital,
      type: 'Text',
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
      type: 'Text',
    },
    {
      id: 7,
      name: 'اطلاعات بیمار',
      value: [
        {
          id: 1,
          name: 'نام بیمار',
          value: patientInfo.name,
          type: 'row-text',
        },
        {
          id: 2,
          name: 'شماره بیمار',
          value: patientInfo.cell,
          type: 'row-text',
        },
        {
          id: 3,
          name: 'کدملی بیمار',
          value: patientInfo.nationalCode,
          type: 'row-text',
        },
        {
          id: 4,
          name: 'مرکز انخاب شده',
          value: patientInfo.selectServeis,
          type: 'row-text',
        },
      ],
      shouldShow: true,
      type: 'Accordion',
    },
    {
      id: 8,
      name: 'قوانین',
      value: rules?.map((items, index) => ({
        id: index,
        name: items,
        type: 'label',
      })),
      shouldShow: true,
      type: 'Accordion',
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
