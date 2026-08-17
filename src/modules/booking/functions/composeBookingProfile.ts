import type { DoctorCentersResponse } from '@/common/apis/services/doctor/getDoctorCenters';
import type { CenterInsuranceResponse } from '@/common/apis/services/doctor/getCenterInsurances';
import type { DoctorExpertiseResponse } from '@/common/apis/services/doctor/getDoctorExpertise';
import type { DoctorFullNameResponse } from '@/common/apis/services/doctor/getDoctorFullName';
import type { DoctorSlugValidationResponse } from '@/common/apis/services/doctor/validateDoctorSlug';
import type { SamanCenterBookingSettingsPayload } from '@/common/apis/services/booking/samanCenterBookingSettings';
import { mapDoctorCenterToProfileCenter } from './mergeBookableCentersFromDoctorCenters';

export type FullProfilePayload = Record<string, any> | null | undefined;

export type ComposeBookingProfileInput = {
  slugInfo?: DoctorSlugValidationResponse | null;
  fullName?: DoctorFullNameResponse | null;
  expertise?: DoctorExpertiseResponse[] | null;
  doctorCenters?: DoctorCentersResponse[] | null;
  /** `data` object from full-profile envelope; null when request failed */
  fullProfile?: FullProfilePayload;
  /** Saman booking-settings keyed by center id — preferred over full-profile settings */
  settingsByCenterId?: Record<string, SamanCenterBookingSettingsPayload | null>;
  /** drprofile center insurances keyed by center id — not from full-profile */
  insurancesByCenterId?: Record<string, CenterInsuranceResponse[] | null>;
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

const mergeCenterWithFullProfile = (
  center: ReturnType<typeof mapDoctorCenterToProfileCenter>,
  fullProfileCenter: Record<string, any> | undefined,
  samanSettings: SamanCenterBookingSettingsPayload | null | undefined,
  centerInsurances: CenterInsuranceResponse[] | null | undefined,
) => {
  const base = fullProfileCenter
    ? {
        ...center,
        user_center_id: center.user_center_id ?? fullProfileCenter.user_center_id ?? null,
        server_id: center.server_id ?? fullProfileCenter.server_id,
        freeturn: fullProfileCenter.freeturn ?? null,
        freeturn_text: fullProfileCenter.freeturn_text ?? null,
        freeturns_info: fullProfileCenter.freeturns_info ?? null,
        // Services come from drprofile /centers/{id}/services (booking + profile hydrate there).
        // full-profile service ids can be stale and break factor/v2 + getFreeTurn.
        services: center.services?.length ? center.services : [],
        is_active: fullProfileCenter.is_active ?? center.is_active,
        waiting_time_info: fullProfileCenter.waiting_time_info,
      }
    : center;

  return {
    ...base,
    settings: samanSettings ?? null,
    insurances: centerInsurances ?? null,
  };
};

/**
 * Prefer granular drprofile APIs; fill gaps from full-profile.
 * center.settings and center.insurances are attached in BookingSteps for the selected center.
 */
export const composeBookingProfile = (input: ComposeBookingProfileInput): Record<string, any> | null => {
  const { slugInfo, fullName, expertise, doctorCenters, fullProfile, settingsByCenterId, insurancesByCenterId } =
    input;
  const fp = fullProfile ?? null;

  const hasDoctorCenters = Array.isArray(doctorCenters) && doctorCenters.length > 0;
  if (!slugInfo && !fp && !hasDoctorCenters) {
    return null;
  }

  const name = fullName?.name || fp?.name || '';
  const family = fullName?.family || fp?.family || '';
  const displayName = [name, family].filter(Boolean).join(' ').trim() || fp?.display_name || '';

  const centersFromApi = hasDoctorCenters
    ? doctorCenters!.map(center => {
        const centerId = String(center.id);
        const mapped = mapDoctorCenterToProfileCenter(center);
        const fpCenter = fp?.centers?.find((item: any) => String(item.id) === centerId);
        return mergeCenterWithFullProfile(
          mapped,
          fpCenter,
          settingsByCenterId?.[centerId],
          insurancesByCenterId?.[centerId],
        );
      })
    : null;

  const centers =
    centersFromApi ??
    (Array.isArray(fp?.centers)
      ? fp!.centers.map((fpCenter: any) => {
          const centerId = String(fpCenter.id);
          return mergeCenterWithFullProfile(
            mapDoctorCenterToProfileCenter({
              id: centerId,
              name: fpCenter.name ?? '',
              display_number: fpCenter.display_number_array ?? fpCenter.display_number ?? [],
              tell: fpCenter.tell_array ?? fpCenter.tell ?? [],
              address: fpCenter.address ?? '',
              type_id: fpCenter.center_type ?? fpCenter.type_id ?? 0,
              status: fpCenter.status ?? 1,
              server_id: fpCenter.server_id,
              user_center_id: fpCenter.user_center_id,
              active_booking: fpCenter.is_active,
              has_bookable_services: true,
              city: {
                id: 0,
                name: typeof fpCenter.city === 'string' ? fpCenter.city : fpCenter.city?.name ?? '',
                slug: fpCenter.city_en_slug ?? '',
                province: { id: 0, name: fpCenter.province ?? '', slug: '' },
              },
              location: fpCenter.map ?? { lat: 0, lon: 0 },
            }),
            fpCenter,
            settingsByCenterId?.[centerId],
            insurancesByCenterId?.[centerId],
          );
        })
      : []);

  const mappedExpertise =
    Array.isArray(expertise) && expertise.length > 0 ? mapExpertiseForBooking(expertise) : fp?.expertises ?? null;

  return {
    ...(fp ?? {}),
    id: slugInfo?.owner_id ?? fp?.id ?? null,
    server_id: slugInfo?.server_id ?? fp?.server_id ?? null,
    user_id: slugInfo?.user_id ?? fp?.user_id ?? null,
    slug: slugInfo?.slug ?? fp?.slug ?? null,
    name,
    family,
    display_name: displayName,
    expertises: mappedExpertise,
    centers,
    online_visit_channel_types: fp?.online_visit_channel_types ?? null,
    feedback_visit: fp?.feedback_visit ?? null,
    city_en_slug:
      fp?.city_en_slug ??
      centers.find((center: any) => center?.city_en_slug)?.city_en_slug ??
      null,
  };
};
