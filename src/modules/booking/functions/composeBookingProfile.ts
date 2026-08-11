import type { DoctorCentersResponse } from '@/common/apis/services/doctor/getDoctorCenters';
import type { DoctorExpertiseResponse } from '@/common/apis/services/doctor/getDoctorExpertise';
import type { DoctorFullNameResponse } from '@/common/apis/services/doctor/getDoctorFullName';
import type { DoctorSlugValidationResponse } from '@/common/apis/services/doctor/validateDoctorSlug';
import { mapDoctorCenterToProfileCenter } from './mergeBookableCentersFromDoctorCenters';

export type FullProfilePayload = Record<string, any> | null | undefined;

export type ComposeBookingProfileInput = {
  slugInfo?: DoctorSlugValidationResponse | null;
  fullName?: DoctorFullNameResponse | null;
  expertise?: DoctorExpertiseResponse[] | null;
  doctorCenters?: DoctorCentersResponse[] | null;
  /** `data` object from full-profile envelope; null when request failed */
  fullProfile?: FullProfilePayload;
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
  fullProfileCenter?: Record<string, any>,
) => {
  if (!fullProfileCenter) {
    return center;
  }

  return {
    ...center,
    user_center_id: center.user_center_id ?? fullProfileCenter.user_center_id ?? null,
    server_id: center.server_id ?? fullProfileCenter.server_id,
    settings: fullProfileCenter.settings ?? null,
    insurances: fullProfileCenter.insurances ?? null,
    user_center_desk: fullProfileCenter.user_center_desk ?? null,
    freeturn: fullProfileCenter.freeturn ?? null,
    freeturn_text: fullProfileCenter.freeturn_text ?? null,
    freeturns_info: fullProfileCenter.freeturns_info ?? null,
    // Services come from drprofile /centers/{id}/services (booking + profile hydrate there).
    // full-profile service ids can be stale and break factor/v2 + getFreeTurn.
    services: center.services?.length ? center.services : [],
    is_active: fullProfileCenter.is_active ?? center.is_active,
    waiting_time_info: fullProfileCenter.waiting_time_info,
  };
};

/**
 * Prefer granular drprofile APIs; fill gaps from full-profile.
 * When full-profile is null/failed, gap fields stay null and booking can still proceed
 * with centers.user_center_id / server_id from the centers API.
 */
export const composeBookingProfile = (input: ComposeBookingProfileInput): Record<string, any> | null => {
  const { slugInfo, fullName, expertise, doctorCenters, fullProfile } = input;
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
        const mapped = mapDoctorCenterToProfileCenter(center);
        const fpCenter = fp?.centers?.find((item: any) => String(item.id) === String(center.id));
        return mergeCenterWithFullProfile(mapped, fpCenter);
      })
    : null;

  const centers =
    centersFromApi ??
    (Array.isArray(fp?.centers)
      ? fp!.centers.map((fpCenter: any) =>
          mergeCenterWithFullProfile(
            mapDoctorCenterToProfileCenter({
              id: String(fpCenter.id),
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
          ),
        )
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
