import { UpcomingAppointment } from '../apis/upcomingAppointments';

export type DoctorHomeFeedItemType =
  | 'stats'
  | 'online_visit'
  | 'actions'
  | 'alert'
  | 'alerts'
  | 'appointments_list'
  | 'reviews_list'
  | 'appointment'
  | 'review'
  | 'divider'
  | 'loading'
  | 'empty';

export interface DoctorHomeFeedStats {
  performanceScore: number | null;
  isPerformanceLoading: boolean;
  satisfactionRating: number | null;
  satisfactionReviewCount: number | null;
  isSatisfactionLoading: boolean;
  todayAppointmentsCount: number | null;
  isTodayCountLoading: boolean;
  pageViewCount: number | null;
  isPageViewLoading: boolean;
  slug?: string;
}

export interface DoctorHomeFeedAlert {
  id?: string | number;
  title?: string;
  description?: string;
  sender?: string;
  created_at?: string;
}

export interface DoctorHomeFeedReview {
  id?: string | number;
  description?: string;
  recommended?: string | number | boolean;
  relativeCreatedTime?: string;
  userId?: string | number;
  userName?: string;
  rate?: number | null;
  centerName?: string;
  visited?: boolean;
  likeCount?: number;
  doctorSlug?: string;
}

export type DoctorHomeFeedItem =
  | { id: string; type: 'stats'; data: DoctorHomeFeedStats }
  | {
      id: string;
      type: 'actions';
      data: { onlineVisit?: { userCenterId?: string; hasOnlineVisitCenter: boolean } };
    }
  | {
      id: string;
      type: 'online_visit';
      data: { userCenterId?: string; hasOnlineVisitCenter: boolean };
    }
  | { id: string; type: 'alert'; data: DoctorHomeFeedAlert }
  | { id: string; type: 'alerts'; data: { items: DoctorHomeFeedAlert[] } }
  | {
      id: string;
      type: 'appointments_list';
      data: {
        items: UpcomingAppointment[];
        todayCount: number | null;
        isTodayCountLoading?: boolean;
        isAppointmentsLoading?: boolean;
        isAppointmentsFetching?: boolean;
      };
    }
  | {
      id: string;
      type: 'reviews_list';
      data: { items: DoctorHomeFeedReview[]; slug?: string; doctorUserId?: string };
    }
  | { id: string; type: 'appointment'; data: UpcomingAppointment }
  | { id: string; type: 'review'; data: DoctorHomeFeedReview }
  | { id: string; type: 'divider'; data: { title: string; href?: string; onSeeAll?: () => void } }
  | { id: string; type: 'loading'; data: { variant: 'appointment' | 'review' } }
  | { id: string; type: 'empty'; data: { message: string; href?: string; linkLabel?: string; onLinkClick?: () => void } };
