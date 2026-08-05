import type { SamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import {
  getScopedInPersonAvailability,
  getScopedOnlineVisitAvailability,
} from '@/modules/booking/functions/mapSamanAvailabilityToCenters';

/** True only when Saman reports a bookable Paziresh24 slot (in-person or online). */
export function hasNativePaziresh24Booking(
  centers: { id: string }[],
  samanData?: SamanDoctorAvailabilityStatus | null,
): boolean {
  if (!samanData) return false;
  const inPerson = getScopedInPersonAvailability(centers, samanData);
  const online = getScopedOnlineVisitAvailability(centers, samanData);
  return inPerson.bookingAvailable || online.bookingAvailable;
}

/**
 * Show Risman only when Saman has settled and Paziresh24 has no native bookable slot.
 * Decision source is Saman only — never Full-profile isBulk / hours_of_work.
 * While Saman is pending: hide Risman (avoids wrong flash on native-bookable doctors).
 * On Saman error: treat as no native booking so external Risman can still surface.
 */
export function shouldShowRismanExternalBooking(
  rismanData: unknown,
  centers: { id: string }[],
  samanData: SamanDoctorAvailabilityStatus | undefined,
  samanStatus: 'pending' | 'success' | 'error',
): boolean {
  if (!rismanData) return false;
  if (samanStatus === 'pending') return false;
  if (samanStatus === 'error') return true;
  return !hasNativePaziresh24Booking(centers, samanData);
}
