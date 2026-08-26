import Alert from '@/common/components/atom/alert';
import InfoIcon from '@/common/components/icons/info';
import { WarningIcon } from '@/common/components/icons/warning';
import MessengerButton from '@/modules/myTurn/components/messengerButton/messengerButton';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { createElement } from 'react';

type Patient = {
  name: string;
  cell: string;
  nationalCode: string;
  selectServeis: string;
};

type MessengerDataType = {
  text: string;
  id: string;
  image?: string;
};
interface TurnDetailsDataParam {
  data: {
    bookTime: string;
    waitingTime?: string;
    turnStatus?: string;
    trackingCode: string;
    doctorPhone?: string;
    onlineChannel?: string;
    durationConversation?: string;
    centerName: string;
    receiptLink?: string;
    centerPhone?: string;
    address?: string;
    centerId: string;
    bookId?: string;
    patientInfo: Patient;
    rules?: string[];
    messengerList?: Record<string, MessengerDataType>;
    selectedChannel?: any;
    isDeleted?: boolean;
    doctorName?: string;
    channels?: Record<string, any>[],
    service?: any
  };
  centerType: CenterType;
  metaData?: {
    messengerButtonType?: string;
    possibilityBeingVisited?: boolean;
  };
}

export const turnDetailsData = ({ data, centerType, metaData }: TurnDetailsDataParam) => {
  const {
    bookTime,
    trackingCode,
    onlineChannel,
    waitingTime,
    centerName,
    centerPhone,
    address,
    centerId,
    bookId,
    patientInfo,
    receiptLink,
    rules,
    doctorPhone,
    durationConversation,
    turnStatus,
    messengerList,
    selectedChannel,
    isDeleted,
    doctorName,
    channels,
    service
  } = data;

  if (service?.service_type_id == 9) {
    return [
      {
        id: 1,
        name: "زمان دقیق نوبت",
        value: bookTime,
        type: 'Text',
        isBoldValue: true,
        calendarEvent: bookId ? { bookId, centerId, isDeleted: Boolean(isDeleted) } : undefined,
      },
      {
        id: 3,
        name: 'کد پیگیری',
        value: trackingCode,
        type: 'Text',
        isBoldValue: false,
      },
      {
        id: 4,
        name: 'لینک قبض نوبت',
        value: receiptLink,
        copyable: true,
        type: 'Text',
        isBoldValue: false,
      },
      {
        id: 5,
        name: 'توضیحات',
        value:
          createElement(Alert, {
            severity: 'warning',
            className: 'p-3 text-amber-800 text-sm',
          }, createElement('div', { className: 'flex items-start gap-2' },
            createElement(WarningIcon, { className: 'w-5 h-5 min-w-5 text-amber-800' }),
            createElement('span', null,
              createElement('span', { className: 'text-amber-800 font-semibold' }, 'نکته مهم:'),
              ' ',
              createElement('span', { className: 'text-black' }, 'این نوبت کاملاً آنلاین است و نیازی به مراجعه  حضوری به بیمارستان نیست.'),
            ),
          )),
        type: 'Label',
        isBoldValue: true,
      },
      {
        id: 6,
        name: 'نوع خدمت',
        value: service.title,
        type: 'Text',
        isBoldValue: false,
      },
      {
        id: 7,
        name: "مرکز درمانی",
        value: centerName,
        type: 'Text',
        isBoldValue: false,
      },
      {
        id: 8,
        name: 'اطلاعات بیمار',
        value: [
          {
            name: 'نام بیمار',
            value: patientInfo.name,
            type: 'Text',
          },
          {
            name: 'کدملی',
            value: patientInfo.nationalCode,
            type: 'Text',
          },
          {
            name: 'شماره موبایل',
            value: patientInfo.cell,
            type: 'Text',
          },
        ],
        type: 'Accordion',
        isOpen: false,
      },
      {
        id: 9,
        name: 'قوانین',
        value: rules?.map((items, index) => ({
          id: index,
          value: items,
          type: 'Label',
        })),
        type: 'Accordion',
      },
    ]
  }

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان تقریبی نوبت',
      value: bookTime,
      shouldShow: turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: true,
      calendarEvent: bookId ? { bookId, centerId, isDeleted: Boolean(isDeleted) } : undefined,
    },
    {
      id: 17,
      name: 'نام پیام رسان',
      value: onlineChannel && messengerList?.[onlineChannel]?.text,
      shouldShow: centerType === CenterType.consult && channels && !channels?.some?.(item => item.type == 'whatsapp'),
      type: 'Text',
      isBoldValue: true,
    },
    {
      id: 13,
      name: `شماره ${messengerList?.[onlineChannel ?? '']?.text} پزشک`,
      value: doctorPhone,
      shouldShow: centerType === CenterType.consult && channels && !channels?.some?.(item => item.type == 'whatsapp'),
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 2,
      value: createElement(MessengerButton, {
        channel: selectedChannel,
        colorFull: true,
      }),
      shouldShow:
        metaData?.messengerButtonType === 'COLOR_FULL' &&
        metaData?.possibilityBeingVisited &&
        centerType === CenterType.consult &&
        !isDeleted &&
        onlineChannel,
      type: 'Label',
      isBoldValue: true,
    },
    {
      id: 2,
      name: 'توضیحات',
      value:
        turnStatus === BookStatus.requested
          ? `کاربر گرامی درخواست شما ثبت شد اما این درخواست به منزله ثبت و قطعی شدن نوبت شما نمی باشد. نتیجه درخواست و زمان دقیق مراجعه شما پس از بررسی توسط مرکز درمانی از طریق پیامک به شما اطلاع داده می شود. همینطور شما میتوانید وضعیت درخواست خود را از طریق صفحه نوبت های من مشاهده کنید.`
          : 'زمان نوبت اعلام شده، برای حضور در مرکز درمانی بوده و با زمان ویزیت تفاوت دارد.',
      shouldShow: centerType == CenterType.clinic,
      icon: createElement(InfoIcon, {
        className: 'text-orange-500',
      }),
      type: 'Label',
      isBoldValue: true,
    },
    {
      id: 3,
      name: 'مدت زمان گفتگو',
      value: `تا ${durationConversation} روز`,
      shouldShow: centerType === CenterType.consult && durationConversation,
      type: 'Text',
      isBoldValue: true,
    },
    {
      id: 12,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: trackingCode,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 4,
      name: ` میانگین زمان انتظار در مرکز`,
      value: waitingTime,
      shouldShow: !!waitingTime && centerType === CenterType.clinic && turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 6,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType !== CenterType.consult,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 6,
      name: 'نام پزشک',
      value: doctorName,
      shouldShow: centerType !== CenterType.consult,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 7,
      name: 'تماس با مرکز درمانی',
      value: centerPhone,
      buttonAction: () => {
        return (location.href = `tel:${centerPhone}`);
      },
      shouldShow: !!centerPhone && centerType === CenterType.clinic,
      type: 'Button',
    },
    {
      id: 8,
      name: 'آدرس مرکز',
      value: address,
      shouldShow: centerId !== '5532',
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 12,
      name: 'خدمت',
      value: patientInfo.selectServeis,
      shouldShow: centerType === CenterType.clinic && turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 14,
      name: 'لینک قبض نوبت',
      value: receiptLink,
      copyable: true,
      shouldShow: centerType === CenterType.consult,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 15,
      name: 'اطلاعات بیمار',
      value: [
        {
          name: 'نام بیمار',
          value: patientInfo.name,
          type: 'Text',
        },
        {
          name: 'کدملی',
          value: patientInfo.nationalCode,
          type: 'Text',
        },
        {
          name: 'شماره موبایل',
          value: patientInfo.cell,
          type: 'Text',
        },
      ],
      shouldShow: turnStatus !== BookStatus.requested,
      type: 'Accordion',
      isOpen: centerType !== CenterType.consult,
    },
    {
      id: 15,
      name: centerType === CenterType.consult ? 'نحوه ویزیت آنلاین' : 'قوانین',
      value: rules?.map((items, index) => ({
        id: index,
        value: items,
        type: 'Label',
      })),
      shouldShow: !!rules && centerType === CenterType.clinic,
      type: 'Accordion',
    },
    {
      id: 16,
      name: 'نحوه ویزیت آنلاین',
      value: rules,
      shouldShow: false,
      type: 'Label',
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
