import { Messenger } from '@/common/constants/messengers';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '../../types/paymentStatus';

export interface TurnProps {
  status: BookStatus;
  paymentStatus: PaymentStatus;
  id: string;
  centerType: CenterType;
  centerInfo: {
    centerId: string;
    centerType: string;
    hasPaging: boolean;
    activePaymentStatus: boolean;
    serviceId: string;
    userCenterId: string;
  };
  doctorInfo: {
    avatar: string;
    firstName: string;
    lastName: string;
    expertise?: string;
    slug: string;
    onlineVisitChannel?: OnlineVisitChannel;
  };
  patientInfo: {
    nationalCode: string;
    cell: string;
  };
  turnDetails: {
    bookTime: number;
    waitingTime?: string;
    trackingCode: string;
    centerName: string;
    patientName: string;
    description: string;
  };
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  feedbackUrl: string | null;
  prescription?: {
    pdf?: string;
  };
}

export type OnlineVisitChannel = {
  type: Messenger;
  channel: string;
  channel_link: string;
};
