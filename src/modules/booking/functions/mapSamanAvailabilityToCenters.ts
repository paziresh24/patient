import { CENTERS } from '@/common/types/centers';
import type { SamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import moment from 'jalali-moment';

const calendarFormat = {
  sameDay: '[امروز] ساعت HH:mm',
  nextDay: '[فردا] ساعت HH:mm',
  sameElse: 'jD jMMMM ساعت HH:mm',
} as const;

export const formatSamanAvailabilityTime = (timeString?: string | null) => {
  if (!timeString) return '';
  return moment(timeString).locale('fa').calendar(undefined, calendarFormat);
};

const findCenterAvailability = (samanData: SamanDoctorAvailabilityStatus | undefined, centerId: string) => {
  return samanData?.centers?.find(item => item.id === centerId)?.availability_status;
};

/**
 * Enrich profile centers with Saman availability.
 * Does NOT add centers from Saman — output length always equals profileCenters.length.
 */
export const mapSamanAvailabilityToCenters = <T extends { id: string }>(
  profileCenters: T[],
  samanData?: SamanDoctorAvailabilityStatus,
): (T & {
  is_active: boolean;
  freeturn_text: string;
  freeturns_info: {
    available_time: number;
    availalbe_time_text: string;
  }[];
})[] => {
  if (!samanData) {
    return profileCenters.map(center => ({
      ...center,
      is_active: (center as any).is_active ?? true,
      freeturn_text: (center as any).freeturn_text ?? '',
      freeturns_info: (center as any).freeturns_info ?? [],
    }));
  }

  return profileCenters.map(center => {
    const availability = findCenterAvailability(samanData, center.id);
    const freeturnText = formatSamanAvailabilityTime(availability?.nearest_time_slot);
    const availableTimeText = formatSamanAvailabilityTime(availability?.nearest_available_time);
    const availableTimeUnix = availability?.nearest_available_time
      ? Math.floor(new Date(availability.nearest_available_time).getTime() / 1000)
      : Date.now() / 1000;

    return {
      ...center,
      is_active: availability?.booking_available ?? false,
      freeturn_text: freeturnText,
      freeturns_info:
        !availability?.booking_available && availability?.nearest_available_time
          ? [
              {
                available_time: availableTimeUnix,
                availalbe_time_text: availableTimeText,
              },
            ]
          : [],
    };
  });
};

export const getScopedInPersonAvailability = (
  profileCenters: { id: string }[],
  samanData?: SamanDoctorAvailabilityStatus,
) => {
  const inPersonCenters = profileCenters.filter(center => center.id !== CENTERS.CONSULT);
  if (inPersonCenters.length === 0) {
    return { bookingAvailable: false, nearestAvailableTime: null as string | null };
  }

  if (!samanData) {
    return { bookingAvailable: false, nearestAvailableTime: null as string | null };
  }

  const availableCenters = inPersonCenters
    .map(center => findCenterAvailability(samanData, center.id))
    .filter(Boolean);

  const bookingAvailable = availableCenters.some(item => item?.booking_available);
  const nearestAvailableTime =
    availableCenters
      .filter(item => !item?.booking_available && item?.nearest_available_time)
      .map(item => item!.nearest_available_time!)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ?? null;

  return { bookingAvailable, nearestAvailableTime };
};

export const getScopedOnlineVisitAvailability = (
  profileCenters: { id: string }[],
  samanData?: SamanDoctorAvailabilityStatus,
) => {
  const hasConsultCenter = profileCenters.some(center => center.id === CENTERS.CONSULT);
  if (!hasConsultCenter || !samanData) {
    return { bookingAvailable: false, nearestTimeSlot: null as string | null, nearestAvailableTime: null as string | null };
  }

  const consultAvailability =
    findCenterAvailability(samanData, CENTERS.CONSULT) ?? samanData.online_visit_availability;

  return {
    bookingAvailable: consultAvailability?.booking_available ?? false,
    nearestTimeSlot: consultAvailability?.nearest_time_slot ?? null,
    nearestAvailableTime: consultAvailability?.nearest_available_time ?? null,
  };
};

export const isCenterBookingAvailable = (
  centerId: string,
  samanData?: SamanDoctorAvailabilityStatus,
) => {
  if (!samanData) return true;
  return findCenterAvailability(samanData, centerId)?.booking_available ?? false;
};
