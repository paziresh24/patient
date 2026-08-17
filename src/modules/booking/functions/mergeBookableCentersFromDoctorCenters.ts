import type { DoctorCentersResponse } from '@/common/apis/services/doctor/getDoctorCenters';

export const mapDoctorCenterToProfileCenter = (newCenter: DoctorCentersResponse) => ({
  ...newCenter,
  display_number_array: newCenter.display_number,
  tell_array: newCenter.tell,
  center_type: newCenter.type_id,
  city: newCenter.city?.name,
  city_en_slug: newCenter.city?.slug,
  province: newCenter.city?.province?.name,
  map: newCenter.location
    ? {
        lat: newCenter.location.lat,
        lon: newCenter.location.lon,
      }
    : null,
  user_center_id: newCenter.user_center_id ?? null,
  server_id: newCenter.server_id,
  is_active: newCenter.active_booking ?? true,
  // settings: filled from Saman booking-settings in composeBookingProfile; null until then
  settings: null as Record<string, unknown> | null,
  // insurances: filled later when booking_enable_insurance is on (SELECT_USER)
  insurances: null as unknown[] | null,
  user_center_desk: null as string | null,
  freeturn: null as number | null,
  freeturn_text: null as string | null,
  freeturns_info: null as unknown[] | null,
  services: [] as unknown[],
});

/** Filter profile centers to bookable IDs and add any bookable center missing from full-profile (e.g. 5532). */
export const mergeBookableCentersFromDoctorCenters = <T extends { id: string }>(
  profileCenters: T[],
  bookableCenters?: DoctorCentersResponse[],
): T[] => {
  if (!bookableCenters?.length) return profileCenters;

  const bookableIds = new Set(bookableCenters.map(center => String(center.id)));
  let list = profileCenters.filter(center => bookableIds.has(String(center.id)));

  const existingIds = new Set(list.map(center => String(center.id)));
  for (const bookableCenter of bookableCenters) {
    if (existingIds.has(String(bookableCenter.id))) continue;
    list = [...list, mapDoctorCenterToProfileCenter(bookableCenter) as unknown as T];
  }

  return list;
};
