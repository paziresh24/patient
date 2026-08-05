import type { SamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import {
  getScopedInPersonAvailability,
  getScopedOnlineVisitAvailability,
} from '@/modules/booking/functions/mapSamanAvailabilityToCenters';

/** True when Saman (or legacy isBulk fallback) says Paziresh24 can take a booking. */
export function hasNativePaziresh24Booking(
  centers: { id: string }[],
  samanData?: SamanDoctorAvailabilityStatus,
  isBulk?: boolean,
): boolean {
  if (samanData) {
    const inPerson = getScopedInPersonAvailability(centers, samanData);
    const online = getScopedOnlineVisitAvailability(centers, samanData);
    return inPerson.bookingAvailable || online.bookingAvailable;
  }
  return !isBulk;
}

/**
 * Show Risman external booking only when Paziresh24 has no native bookable slot.
 * Before Saman resolves, fall back to legacy isBulk to limit Risman flash on known-native doctors.
 */
export function shouldShowRismanExternalBooking(
  rismanData: unknown,
  centers: { id: string }[],
  samanData: SamanDoctorAvailabilityStatus | undefined,
  isBulk: boolean,
  samanResolved: boolean,
): boolean {
  if (!rismanData) return false;
  if (samanResolved) {
    return !hasNativePaziresh24Booking(centers, samanData, isBulk);
  }
  return !!isBulk;
}
