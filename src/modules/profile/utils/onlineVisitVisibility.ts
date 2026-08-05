import type { SamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { CENTERS } from '@/common/types/centers';
import { getScopedOnlineVisitAvailability } from '@/modules/booking/functions/mapSamanAvailabilityToCenters';

export type OnlineVisitProfileGate = {
  enabled?: boolean | null;
};

/** Legacy full-profile gate from `consult_active_booking` — kept for rollback, not used for display. */
export const isLegacyConsultActiveBookingEnabled = (onlineVisit?: OnlineVisitProfileGate) =>
  Boolean(onlineVisit?.enabled);

/**
 * Gate 1 (centers API): slug has bookable online visit center 5532
 * (`check_bookable_services=true` → has_bookable_services / active_booking).
 */
export const hasBookableOnlineVisitCenter = (centers?: { id: string }[]) =>
  Boolean(centers?.some(center => String(center.id) === CENTERS.CONSULT));

/**
 * Show online visit on profile when:
 * 1) centers list includes 5532 (from bookable centers API), and
 * 2) Saman is not loaded yet OR Saman says online booking is available
 *    (center 5532 or online_visit_availability).
 *
 * `onlineVisit.enabled` / consult_active_booking is intentionally ignored (legacy, kept for rollback).
 */
export type OnlineVisitVisibilityReason =
  | 'no_bookable_5532'
  | 'shown_pending_saman'
  | 'saman_unavailable'
  | 'shown';

export const getProfileOnlineVisitVisibility = ({
  centers,
  samanLoaded,
  samanData,
}: {
  centers?: { id: string }[];
  /** @deprecated consult_active_booking gate disabled — centers API + Saman drive visibility */
  onlineVisit?: OnlineVisitProfileGate;
  samanLoaded: boolean;
  samanData?: SamanDoctorAvailabilityStatus;
}): { show: boolean; reason: OnlineVisitVisibilityReason } => {
  if (!hasBookableOnlineVisitCenter(centers)) {
    return { show: false, reason: 'no_bookable_5532' };
  }
  if (!samanLoaded) {
    return { show: true, reason: 'shown_pending_saman' };
  }
  const available = getScopedOnlineVisitAvailability(centers ?? [], samanData).bookingAvailable;
  return {
    show: available,
    reason: available ? 'shown' : 'saman_unavailable',
  };
};

export const shouldShowProfileOnlineVisit = (args: {
  centers?: { id: string }[];
  onlineVisit?: OnlineVisitProfileGate;
  samanLoaded: boolean;
  samanData?: SamanDoctorAvailabilityStatus;
}) => getProfileOnlineVisitVisibility(args).show;
