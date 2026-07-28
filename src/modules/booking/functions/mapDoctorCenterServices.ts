import type { DoctorCenterServiceResponse } from '@/common/apis/services/doctor/getDoctorCenterServices';

/**
 * Map drprofile center services into the legacy full-profile service shape
 * used by booking (getFreeTurn / book / SelectService).
 *
 * Clinic APIs need:
 * - service_id = item.service.id (NOT item.id which is like "uuid|1")
 * - user_center_id = center.user_center_id
 */
export const mapDoctorCenterServices = (
  items: DoctorCenterServiceResponse[],
  centerUserCenterId?: string | null,
) => {
  return items.map(item => ({
    id: item.service.id,
    center_service_id: item.id,
    alias_title: item.service.title,
    can_booking: item.can_booking ? 1 : 0,
    can_request: item.can_request ? 1 : 0,
    user_center_id: centerUserCenterId ?? undefined,
    free_price: item.service.price,
    description: item.service.description,
    // Truthy placeholder so reformattedServicesProperty does not disable the row;
    // work hours are enforced by clinic getFreeTurn, not this payload.
    hours_of_work: item.can_booking ? [] : null,
    duration: item.duration,
    request_description: item.request_description,
    terms_and_conditions: item.terms_and_conditions,
    service_type_id: item.service.service_type_id,
    server_id: item.service.server_id,
  }));
};

export const isInvalidProfileServiceId = (serviceId?: string | number | null) => {
  if (serviceId == null || serviceId === '') return true;
  return String(serviceId) === '-1';
};
