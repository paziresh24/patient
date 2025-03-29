import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { Translate } from 'next-translate';
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
  isDelete: boolean;
  paymentStatus: PaymentStatus;
  activePaymentStatus: Boolean;
  centerType: CenterType;
  translate: Translate;
}

export const turnDetailsData = ({
  data,
  status,
  isDelete,
  centerType,
  paymentStatus,
  activePaymentStatus,
  translate,
}: TurnDetailsDataParam) => {
  const { bookTime, trackingCode, waitingTime, centerName, patientName } = data;

  const lists = [
    {
      id: 1,
      name:
        centerType === CenterType.consult
          ? translate('patient/appointments:turnDetails.timeForConsult')
          : translate('patient/appointments:turnDetails.time'),
      value: bookTime,
      shouldShow:
        status !== BookStatus.requested && ([BookStatus.visited, BookStatus.notVisited, BookStatus.expired].includes(status) || isDelete),
    },
    {
      id: 2,
      name: translate('patient/appointments:turnDetails.referred'),
      value: patientName,
      shouldShow:
        [BookStatus.visited, BookStatus.notVisited, BookStatus.expired, BookStatus.requested, BookStatus.rejected].includes(status) ||
        isDelete,
    },
    {
      id: 3,
      name: 'وضعیت پرداخت',
      value: PAYMENT_STATUS_TRANSLATION[paymentStatus],
      shouldShow: activePaymentStatus,
    },
    {
      id: 4,
      name: translate('patient/appointments:turnDetails.trackingCode'),
      value: trackingCode,
      shouldShow:
        [BookStatus.visited, BookStatus.notVisited, BookStatus.expired, BookStatus.requested, BookStatus.rejected].includes(status) ||
        isDelete,
    },
    {
      id: 5,
      name: translate('patient/appointments:turnDetails.centerName'),
      value: centerName,
      shouldShow: centerType === CenterType.hospital,
    },
    {
      id: 6,
      name: `${translate('patient/appointments:turnDetails.waitingTime')} ${
        centerType === CenterType.clinic ? translate('common:words.office') : translate('common:words.hospital')
      }`,
      value: waitingTime,
      shouldShow:
        ([BookStatus.visited, BookStatus.notVisited, BookStatus.expired].includes(status) || isDelete) &&
        status !== BookStatus.requested &&
        centerType !== CenterType.consult,
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};
