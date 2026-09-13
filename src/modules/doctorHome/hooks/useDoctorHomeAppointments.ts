import { UserInfo } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useMemo } from 'react';
import { useAppointmentsCount } from '@/modules/profile/apis/appointmentsCount';
import { useUpcomingAppointments } from '../apis/upcomingAppointments';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { useSelectedDateStore } from '../store/selectedDate';
import { matchesSelectedCenter, resolveAppointmentCenters, resolveCountCenterId } from '../utils/centers';
import { doctorHomeListQueryDefaults } from '../utils/doctorHomeQuery';
import { useDoctorHomeContext } from './useDoctorHomeContext';

const getDateRange = (isoDate: string) => {
  const d = moment(isoDate, 'YYYY-MM-DD');
  const dayStart = d.clone().startOf('jDay');
  const dayEnd = d.clone().endOf('jDay');
  return {
    from_greather_than: dayStart.unix(),
    from_less_than: dayEnd.unix(),
  };
};

export const useDoctorHomeAppointments = (user?: UserInfo) => {
  const { isDoctor } = useDoctorHomeContext(user);
  const selectedDate = useSelectedDateStore(s => s.selectedDate);
  const selectedCenterId = useSelectedCenterStore(s => s.selectedCenterId);
  const countCenterId = useMemo(() => resolveCountCenterId(user, selectedCenterId), [user, selectedCenterId]);
  const appointmentCenters = useMemo(
    () => resolveAppointmentCenters(user, selectedCenterId),
    [user, selectedCenterId],
  );

  const upcomingAppointments = useUpcomingAppointments(appointmentCenters, isDoctor, selectedDate);

  const dateRange = useMemo(() => getDateRange(selectedDate), [selectedDate]);
  const hasAppointmentsCache = upcomingAppointments.data != null;
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
    { enabled: shouldUseFallbackCount, ...doctorHomeListQueryDefaults },
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

    if (appointmentItems.length > 0) {
      return appointmentItems.length;
    }

    if (allBooksSettled && shouldUseFallbackCount && fallbackAppointmentsCount.isError) {
      return 0;
    }

    return null;
  }, [
    upcomingAppointments.data,
    appointmentItems.length,
    fallbackAppointmentsCount.data,
    fallbackAppointmentsCount.isError,
    allBooksSettled,
    shouldUseFallbackCount,
  ]);

  const isAppointmentsInitialLoading = upcomingAppointments.isLoading && !hasAppointmentsCache;

  const isTodayCountLoading =
    todayCount == null &&
    !hasAppointmentsCache &&
    (upcomingAppointments.isLoading ||
      (shouldUseFallbackCount && fallbackAppointmentsCount.isLoading && fallbackAppointmentsCount.data == null));

  return {
    isDoctor,
    items: appointmentItems,
    todayCount,
    isTodayCountLoading,
    isAppointmentsInitialLoading,
    isAppointmentsFetching: upcomingAppointments.isFetching && hasAppointmentsCache,
  };
};
