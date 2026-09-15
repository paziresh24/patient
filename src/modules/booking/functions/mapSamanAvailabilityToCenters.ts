import { CENTERS } from '@/common/types/centers';
import type { SamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { getPrimaryInPersonCenter } from '@/modules/profile/functions/getDoctorCities';
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

export const samanTimeToUnixSeconds = (timeString?: string | null): number | null => {
  if (!timeString) return null;
  const ms = new Date(timeString).getTime();
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
};

const findCenterAvailability = (samanData: SamanDoctorAvailabilityStatus | undefined, centerId: string) => {
  return samanData?.centers?.find(item => String(item.id) === String(centerId))?.availability_status;
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
  freeturn: number | null;
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
      freeturn: null,
      freeturn_text: '',
      freeturns_info: [],
    }));
  }

  return profileCenters.map(center => {
    const availability = findCenterAvailability(samanData, center.id);
    const freeturnText = formatSamanAvailabilityTime(availability?.nearest_time_slot);
    const availableTimeText = formatSamanAvailabilityTime(availability?.nearest_available_time);
    const hasFutureAvailabilityWindow = !!availability?.nearest_available_time;
    const bookingAvailableNow = availability?.booking_available ?? false;
    // Online booking can be "opens later today" without being permanently disabled.
    // is_active drives the inactive/hatched UI; freeturns_info drives the "opens at" notice.
    const isActive = bookingAvailableNow || hasFutureAvailabilityWindow;
    const availableTimeUnix = availability?.nearest_available_time
      ? Math.floor(new Date(availability.nearest_available_time).getTime() / 1000)
      : Date.now() / 1000;

    return {
      ...center,
      is_active: isActive,
      freeturn: samanTimeToUnixSeconds(availability?.nearest_time_slot),
      freeturn_text: freeturnText,
      freeturns_info:
        !bookingAvailableNow && hasFutureAvailabilityWindow
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
  const inPersonCenters = profileCenters.filter(center => String(center.id) !== CENTERS.CONSULT);
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
  const hasConsultCenter = profileCenters.some(center => String(center.id) === CENTERS.CONSULT);
  if (!hasConsultCenter || !samanData) {
    return { bookingAvailable: false, nearestTimeSlot: null as string | null, nearestAvailableTime: null as string | null };
  }

  // Prefer center 5532 status; fall back to top-level online_visit_availability (same source of truth as ops checks).
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

/** Fill freeturn_text from Saman when legacy full-profile did not provide it (SEO about block). */
export const enrichProfileCentersWithSamanAvailability = <T extends { id: string; freeturn_text?: string | null }>(
  profileCenters: T[],
  samanData?: SamanDoctorAvailabilityStatus | null,
): T[] => {
  if (!samanData || profileCenters.length === 0) return profileCenters;

  const primaryInPerson = getPrimaryInPersonCenter(profileCenters);
  if (primaryInPerson?.freeturn_text) return profileCenters;

  return mapSamanAvailabilityToCenters(profileCenters, samanData);
};
