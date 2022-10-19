import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';

export interface TurnProps {
  status: BookStatus;
  id: string;
  centerType: CenterType;
  centerInfo: {
    centerId: string;
    centerType: string;
    hasPaging: boolean;
  };
  doctorInfo: {
    avatar: string;
    firstName: string;
    lastName: string;
    expertise?: string;
    slug: string;
    onlineVisitChannels?: OnlineVisitChannels;
  };
  patientInfo: {
    nationalCode: string;
  };
  turnDetails: {
    bookTime: number;
    waitingTime?: string;
    trackingCode: string;
    centerName: string;
    patientName: string;
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

export type OnlineVisitChannels = {
  type: 'igap' | 'whatsapp';
  channel: string;
}[];
