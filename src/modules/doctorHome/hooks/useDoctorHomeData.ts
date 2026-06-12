import { useRate } from '@/common/apis/services/reviews/rate';
import { useGetReview } from '@/common/apis/services/reviews/getReviews';
import { useGetNotifications } from '@/modules/hamdast/apis/notifications';
import { UserInfo } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useMemo } from 'react';
import { useDoctorPageView } from '../apis/pageView';
import { useSanjeScore } from '../apis/sanjeScore';
import { useUpcomingAppointments } from '../apis/upcomingAppointments';
import { getClinicCenters, getDoctorSlug, getOnlineVisitCenter, hasOnlineVisitCenter } from '../utils/centers';
import { useAppointmentsCount } from '@/modules/profile/apis/appointmentsCount';
import { useSelectedDateStore } from '../store/selectedDate';

const getDateRange = (isoDate: string) => {
  const d = moment(isoDate, 'YYYY-MM-DD');
  return {
    from_greather_than: d.clone().startOf('jDay').unix(),
    from_less_than: d.clone().endOf('jDay').unix(),
  };
};

const extractRatingFromRate = (
  rateData: { list?: Array<Record<string, unknown>> } | undefined,
): { rating: number | null; reviewCount: number | null } => {
  const item = rateData?.list?.[0];
  if (!item || item.hide_rates) return { rating: null, reviewCount: null };

  const avg =
    ((Number(item.quality_of_treatment) || 0) +
      (Number(item.doctor_encounter) || 0) +
      (Number(item.explanation_of_issue) || 0)) /
    3;

  if (!avg) return { rating: null, reviewCount: null };

  const reviewCount = Number(item.count_rates);
  return {
    rating: Number(avg.toFixed(1)),
    reviewCount: Number.isFinite(reviewCount) && reviewCount > 0 ? reviewCount : null,
  };
};

const getCountCenterId = (user?: UserInfo) => {
  const centers = user?.provider?.centers ?? [];
  const withUserCenterId = centers.find((center: { user_center_id?: string }) => center.user_center_id);
  if (withUserCenterId?.user_center_id) return String(withUserCenterId.user_center_id);

  const onlineCenter = getOnlineVisitCenter(user) as { user_center_id?: string } | undefined;
  if (onlineCenter?.user_center_id) return String(onlineCenter.user_center_id);

  const firstClinic = getClinicCenters(user)[0] as { id?: string } | undefined;
  if (firstClinic?.id) return String(firstClinic.id);

  return undefined;
};

export const useDoctorHomeData = (user?: UserInfo) => {
  const slug = getDoctorSlug(user);
  const isDoctor = !!user?.is_doctor && user?.provider?.job_title === 'doctor';
  const onlineVisitCenter = getOnlineVisitCenter(user);
  const countCenterId = useMemo(() => getCountCenterId(user), [user]);
  const appointmentCenters = useMemo(
    () =>
      (user?.provider?.centers ?? [])
        .map((center: { id?: string }) => ({ id: center.id }))
        .filter((center): center is { id: string } => !!center.id),
    [user?.provider?.centers],
  );

  const selectedDate = useSelectedDateStore(s => s.selectedDate);

  const sanjeScore = useSanjeScore(isDoctor);
  const pageView = useDoctorPageView(slug);
  const rate = useRate({ slug: slug! }, { enabled: isDoctor && !!slug, staleTime: 5 * 60 * 1000 });
  const upcomingAppointments = useUpcomingAppointments(appointmentCenters, isDoctor, selectedDate);
  const reviews = useGetReview(
    { slug, sort: 'created_at', offset: 0 },
    { enabled: isDoctor && !!slug, staleTime: 2 * 60 * 1000 },
  );
  const notifications = useGetNotifications(undefined, { enabled: isDoctor, staleTime: 60 * 1000 });

  const dateRange = useMemo(() => getDateRange(selectedDate), [selectedDate]);

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

  const satisfaction = useMemo(() => extractRatingFromRate(rate.data), [rate.data]);

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

    const partialItems = upcomingAppointments.data?.items?.length ?? 0;
    if (partialItems > 0) {
      return partialItems;
    }

    if (allBooksSettled && shouldUseFallbackCount && fallbackAppointmentsCount.isError) {
      return 0;
    }

    return null;
  }, [
    upcomingAppointments.data,
    fallbackAppointmentsCount.data,
    fallbackAppointmentsCount.isError,
    allBooksSettled,
    shouldUseFallbackCount,
  ]);

  const isTodayCountLoading =
    todayCount == null &&
    (upcomingAppointments.isLoading ||
      upcomingAppointments.isFetching ||
      (shouldUseFallbackCount && fallbackAppointmentsCount.isLoading));

  const notificationItems = notifications.data?.data?.items ?? [];

  return {
    slug,
    isDoctor,
    hasOnlineVisitCenter: hasOnlineVisitCenter(user),
    onlineVisitUserCenterId: (onlineVisitCenter as { user_center_id?: string } | undefined)?.user_center_id,
    stats: {
      performanceScore: sanjeScore.data?.final_score ?? null,
      isPerformanceLoading: sanjeScore.isLoading,
      satisfactionRating: satisfaction.rating,
      satisfactionReviewCount: satisfaction.reviewCount,
      isSatisfactionLoading: rate.isLoading,
      todayAppointmentsCount: todayCount,
      isTodayCountLoading,
      pageViewCount: pageView.data ?? null,
      isPageViewLoading: pageView.isLoading,
    },
    appointments: {
      items: upcomingAppointments.data?.items ?? [],
      todayCount,
      isLoading: upcomingAppointments.isLoading,
      isError: upcomingAppointments.isError,
    },
    reviews: {
      items: reviews.data?.list ?? [],
      isLoading: reviews.isLoading,
    },
    notifications: notificationItems.slice(0, 3),
    hasNotifications: notificationItems.length > 0,
  };
};
