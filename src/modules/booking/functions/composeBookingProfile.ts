import type { DoctorCentersResponse } from '@/common/apis/services/doctor/getDoctorCenters';
import type { CenterInsuranceResponse } from '@/common/apis/services/doctor/getCenterInsurances';
import type { DoctorExpertiseResponse } from '@/common/apis/services/doctor/getDoctorExpertise';
import type { DoctorFullNameResponse } from '@/common/apis/services/doctor/getDoctorFullName';
import type { DoctorSlugValidationResponse } from '@/common/apis/services/doctor/validateDoctorSlug';
import type { SamanCenterBookingSettingsPayload } from '@/common/apis/services/booking/samanCenterBookingSettings';
import { mapDoctorCenterToProfileCenter } from './mergeBookableCentersFromDoctorCenters';

export type ComposeBookingProfileInput = {
  slugInfo?: DoctorSlugValidationResponse | null;
  fullName?: DoctorFullNameResponse | null;
  expertise?: DoctorExpertiseResponse[] | null;
  doctorCenters?: DoctorCentersResponse[] | null;
  /** Saman booking-settings keyed by center id */
  settingsByCenterId?: Record<string, SamanCenterBookingSettingsPayload | null>;
  /** drprofile center insurances keyed by center id */
  insurancesByCenterId?: Record<string, CenterInsuranceResponse[] | null>;
  /** drprofile /doctors/:slug/online-channels — attached in BookingSteps on SELECT_USER for consult */
  onlineVisitChannelTypes?: string[] | null;
};

const mapExpertiseForBooking = (items: DoctorExpertiseResponse[]) =>
  items.map(item => ({
    alias_title: item.alias_title,
    expertise: item.expertise,
    degree: item.degree,
    expertise_groups: item.groups,
    groups: item.groups,
    graduation_date: item.graduation_date,
  }));

const attachCenterBookingData = (
  center: ReturnType<typeof mapDoctorCenterToProfileCenter>,
  samanSettings: SamanCenterBookingSettingsPayload | null | undefined,
  centerInsurances: CenterInsuranceResponse[] | null | undefined,
) => ({
  ...center,
  user_center_id: center.user_center_id ?? null,
  server_id: center.server_id ?? null,
  is_active: center.is_active ?? null,
  settings: samanSettings ?? null,
  insurances: centerInsurances ?? null,
});

/**
 * Compose booking profile from granular drprofile APIs only.
 * Missing or failed sources stay empty ('' for strings, null otherwise).
 * full-profile is never used as fallback.
 */
export const composeBookingProfile = (input: ComposeBookingProfileInput): Record<string, any> | null => {
  const { slugInfo, fullName, expertise, doctorCenters, settingsByCenterId, insurancesByCenterId, onlineVisitChannelTypes } =
    input;

  const hasDoctorCenters = Array.isArray(doctorCenters) && doctorCenters.length > 0;
  if (!slugInfo && !hasDoctorCenters) {
    return null;
  }

  const name = fullName?.name || '';
  const family = fullName?.family || '';
  const displayName = [name, family].filter(Boolean).join(' ').trim() || '';

  const centers = hasDoctorCenters
    ? doctorCenters!.map(center => {
        const centerId = String(center.id);
        return attachCenterBookingData(
          mapDoctorCenterToProfileCenter(center),
          settingsByCenterId?.[centerId],
          insurancesByCenterId?.[centerId],
        );
      })
    : [];

  const mappedExpertise =
    Array.isArray(expertise) && expertise.length > 0 ? mapExpertiseForBooking(expertise) : null;

  return {
    id: slugInfo?.owner_id ?? null,
    server_id: slugInfo?.server_id ?? null,
    user_id: slugInfo?.user_id ?? null,
    slug: slugInfo?.slug ?? null,
    name,
    family,
    display_name: displayName,
    expertises: mappedExpertise,
    centers,
    online_visit_channel_types: Array.isArray(onlineVisitChannelTypes) ? onlineVisitChannelTypes : null,
    waiting_time_info: null,
    feedback_visit: null,
    city_en_slug: centers.find((center: any) => center?.city_en_slug)?.city_en_slug ?? null,
  };
};
