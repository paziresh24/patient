import { useGetReview } from '@/common/apis/services/reviews/getReviews';
import { useGetNotifications } from '@/modules/hamdast/apis/notifications';
import { UserInfo } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useMemo, useRef, useEffect } from 'react';
import { useDoctorRateStats } from '../apis/doctorRate';
import { useDoctorPageView } from '../apis/pageView';
import { useSanjeScore } from '../apis/sanjeScore';
import { useUpcomingAppointments } from '../apis/upcomingAppointments';
import {
  getDoctorSlug,
  getOnlineVisitCenter,
  hasOnlineVisitCenter,
  matchesSelectedCenter,
  resolveAppointmentCenters,
  resolveCountCenterId,
  shouldShowOnlineVisitSection,
} from '../utils/centers';
import { useAppointmentsCount } from '@/modules/profile/apis/appointmentsCount';
import { getTehranDayUtcBounds } from '@/common/utils/nocodbDateFilter';
import { useSelectedDateStore } from '../store/selectedDate';
import { useSelectedCenterStore } from '../store/selectedCenter';

const getDateRange = (isoDate: string) => {
  const d = moment(isoDate, 'YYYY-MM-DD');
  const dayStart = d.clone().startOf('jDay');
  const dayEnd = d.clone().endOf('jDay');
  return {
    from_greather_than: dayStart.unix(),
    from_less_than: dayEnd.unix(),
  };
};

const getCountCenterId = resolveCountCenterId;

export const useDoctorHomeData = (user?: UserInfo) => {
  const slug = getDoctorSlug(user);
  const isDoctor = !!user?.is_doctor && user?.provider?.job_title === 'doctor';
  const onlineVisitCenter = getOnlineVisitCenter(user);
  const selectedDate = useSelectedDateStore(s => s.selectedDate);
  const selectedCenterId = useSelectedCenterStore(s => s.selectedCenterId);
  const countCenterId = useMemo(() => getCountCenterId(user, selectedCenterId), [user, selectedCenterId]);
  const appointmentCenters = useMemo(
    () => resolveAppointmentCenters(user, selectedCenterId),
    [user, selectedCenterId],
  );

  const sanjeScore = useSanjeScore(isDoctor);
  const pageView = useDoctorPageView(slug);
  const rateStats = useDoctorRateStats(slug, isDoctor);
  const upcomingAppointments = useUpcomingAppointments(appointmentCenters, isDoctor, selectedDate);
  const hasLoadedAppointmentsOnce = useRef(false);

  useEffect(() => {
    if (upcomingAppointments.isSuccess) {
      hasLoadedAppointmentsOnce.current = true;
    }
  }, [upcomingAppointments.isSuccess]);
  const dateRange = useMemo(() => getDateRange(selectedDate), [selectedDate]);
  const createdAtBounds = useMemo(() => getTehranDayUtcBounds(selectedDate), [selectedDate]);
  const reviews = useGetReview(
    {
      slug,
      sort: 'created_at',
      offset: 0,
      limit: 30,
      createdAtFrom: createdAtBounds.from,
      createdAtTo: createdAtBounds.to,
      ...(selectedCenterId ? { center_id: selectedCenterId } : {}),
    },
    { enabled: isDoctor && !!slug, staleTime: 2 * 60 * 1000 },
  );
  const notifications = useGetNotifications(undefined, { enabled: isDoctor, staleTime: 60 * 1000 });

  const allBooksSettled = !upcomingAppointments.isLoading && !upcomingAppointments.isFetching;
  const shouldUseFallbackCount =
    isDoctor &&
    !!countCenterId &&
    (appointmentCenters.length === 0 ||
      upcomingAppointments.isError ||
      (allBooksSettled && upcomingAppointments.data == null));

  const fallbackAppointmentsCount = useAppointmentsCount(
    {
      user_center_id: countCenterId,
      ...dateRange,
      payment_status_in: [3, 4, 5, 6, 7, 8, 9],
    },
    { enabled: shouldUseFallbackCount },
  );

  const appointmentItems = useMemo(() => {
    const items = upcomingAppointments.data?.items ?? [];
    if (!selectedCenterId) return items;
    return items.filter(item => matchesSelectedCenter(item.center_id, selectedCenterId));
  }, [upcomingAppointments.data?.items, selectedCenterId]);

  const todayCount = useMemo(() => {
    const fromAllBooks = upcomingAppointments.data?.today_count;
    if (fromAllBooks != null && Number.isFinite(fromAllBooks)) {
      return fromAllBooks;
    }

    const fallbackResponse = fallbackAppointmentsCount.data as
      | { data?: { count_book?: number | string } }
      | undefined;
    const fromFallback = Number(fallbackResponse?.data?.count_book);
    if (Number.isFinite(fromFallback)) {
      return fromFallback;
    }

    const partialItems = appointmentItems.length;
    if (partialItems > 0) {
      return partialItems;
    }

    if (allBooksSettled && shouldUseFallbackCount && fallbackAppointmentsCount.isError) {
      return 0;
    }

    return null;
  }, [
    upcomingAppointments.data,
    appointmentItems.length,
    selectedCenterId,
    fallbackAppointmentsCount.data,
    fallbackAppointmentsCount.isError,
    allBooksSettled,
    shouldUseFallbackCount,
  ]);

  const isAppointmentsInitialLoading =
    upcomingAppointments.isLoading && !hasLoadedAppointmentsOnce.current;

  const isTodayCountLoading =
    todayCount == null &&
    (upcomingAppointments.isLoading ||
      upcomingAppointments.isFetching ||
      (shouldUseFallbackCount && fallbackAppointmentsCount.isLoading));

  const notificationItems = (notifications.data?.data?.items ?? []).map(
    (item: {
      id?: string | number;
      title?: string;
      description?: string;
      sender?: string;
      created_at?: string;
      createdAt?: string;
    }) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      sender: item.sender,
      created_at: item.created_at ?? item.createdAt,
    }),
  );

  return {
    slug,
    isDoctor,
    hasOnlineVisitCenter: hasOnlineVisitCenter(user),
    onlineVisitUserCenterId: (onlineVisitCenter as { user_center_id?: string } | undefined)?.user_center_id,
    stats: {
      performanceScore: sanjeScore.data?.final_score ?? null,
      isPerformanceLoading: sanjeScore.isLoading,
      satisfactionRating: rateStats.data?.rating ?? null,
      satisfactionReviewCount: rateStats.data?.rateCount ?? null,
      isSatisfactionLoading: rateStats.isLoading,
      todayAppointmentsCount: todayCount,
      isTodayCountLoading,
      pageViewCount: pageView.data ?? null,
      isPageViewLoading: pageView.isLoading,
    },
    appointments: {
      items: appointmentItems,
      todayCount,
      isLoading: isAppointmentsInitialLoading,
      isFetching: upcomingAppointments.isFetching,
      isError: upcomingAppointments.isError,
    },
    reviews: {
      items: reviews.data?.list ?? [],
      isLoading: reviews.isLoading,
    },
    notifications: notificationItems,
    hasNotifications: notificationItems.length > 0,
  };
};
