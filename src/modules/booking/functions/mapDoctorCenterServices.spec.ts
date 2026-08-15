import {
  filterBookableMappedCenterServices,
  isBookableMappedCenterService,
  mapDoctorCenterServices,
} from './mapDoctorCenterServices';

describe('filterBookableMappedCenterServices', () => {
  it('keeps only can_booking or can_request services', () => {
    const mapped = mapDoctorCenterServices(
      [
        {
          id: 'a|1',
          can_booking: false,
          can_request: false,
          duration: null,
          request_description: null,
          terms_and_conditions: null,
          service: {
            id: 'inactive',
            title: 'قدیمی',
            price: 1000,
            description: null,
            service_type_id: 5,
            server_id: 1,
          },
        },
        {
          id: 'b|1',
          can_booking: true,
          can_request: false,
          duration: null,
          request_description: null,
          terms_and_conditions: null,
          service: {
            id: 'active',
            title: 'فعال',
            price: 5990000,
            description: null,
            service_type_id: 8,
            server_id: 1,
          },
        },
        {
          id: 'c|1',
          can_booking: false,
          can_request: true,
          duration: null,
          request_description: null,
          terms_and_conditions: null,
          service: {
            id: 'request',
            title: 'درخواست',
            price: 0,
            description: null,
            service_type_id: 5,
            server_id: 1,
          },
        },
      ],
      'uc-1',
    );

    expect(filterBookableMappedCenterServices(mapped).map(s => s.id)).toEqual(['active', 'request']);
  });

  it('treats legacy 0/1 flags correctly', () => {
    expect(isBookableMappedCenterService({ can_booking: 0, can_request: 0 })).toBe(false);
    expect(isBookableMappedCenterService({ can_booking: 1, can_request: 0 })).toBe(true);
    expect(isBookableMappedCenterService({ can_booking: 0, can_request: 1 })).toBe(true);
  });
});
