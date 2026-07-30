import { CENTERS } from '@/common/types/centers';
import { mergeBookableCentersFromDoctorCenters } from './mergeBookableCentersFromDoctorCenters';

describe('mergeBookableCentersFromDoctorCenters', () => {
  it('adds online visit center from doctor centers when missing in full-profile', () => {
    const profileCenters = [{ id: 'office-1', name: 'Clinic', services: [{ id: 's1' }] }];
    const bookableCenters = [
      {
        id: CENTERS.CONSULT,
        name: 'Online',
        display_number: [],
        tell: [],
        address: '',
        type_id: 3,
        status: 1,
        server_id: 1,
        has_bookable_services: true,
        city: { id: 1, name: 'Tehran', slug: 'tehran', province: { id: 1, name: 'Tehran', slug: 'tehran' } },
        location: { lat: 0, lon: 0 },
      },
      {
        id: 'office-1',
        name: 'Clinic',
        display_number: [],
        tell: [],
        address: '',
        type_id: 1,
        status: 1,
        server_id: 1,
        has_bookable_services: true,
        city: { id: 1, name: 'Tehran', slug: 'tehran', province: { id: 1, name: 'Tehran', slug: 'tehran' } },
        location: { lat: 0, lon: 0 },
      },
    ];

    const merged = mergeBookableCentersFromDoctorCenters(profileCenters, bookableCenters);

    expect(merged.map(center => center.id)).toEqual(['office-1', CENTERS.CONSULT]);
    expect(merged[0].services).toEqual([{ id: 's1' }]);
    expect(merged[1].services).toEqual([]);
  });

  it('removes centers not in bookable allowlist', () => {
    const profileCenters = [{ id: 'office-1' }, { id: 'office-2' }];
    const bookableCenters = [
      {
        id: 'office-1',
        name: 'Clinic',
        display_number: [],
        tell: [],
        address: '',
        type_id: 1,
        status: 1,
        server_id: 1,
        has_bookable_services: true,
        city: { id: 1, name: 'Tehran', slug: 'tehran', province: { id: 1, name: 'Tehran', slug: 'tehran' } },
        location: { lat: 0, lon: 0 },
      },
    ];

    expect(mergeBookableCentersFromDoctorCenters(profileCenters, bookableCenters).map(c => c.id)).toEqual(['office-1']);
  });
});
