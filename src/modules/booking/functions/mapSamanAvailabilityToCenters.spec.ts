import {
  enrichProfileCentersWithSamanAvailability,
  mapSamanAvailabilityToCenters,
} from './mapSamanAvailabilityToCenters';

describe('enrichProfileCentersWithSamanAvailability', () => {
  it('fills freeturn_text from Saman when missing', () => {
    const centers = [{ id: 'office-1', name: 'مطب تست' }];
    const samanData = {
      centers: [
        {
          id: 'office-1',
          availability_status: {
            booking_available: true,
            nearest_time_slot: '2026-08-19T07:10:00.000Z',
          },
        },
      ],
    } as any;

    const enriched = enrichProfileCentersWithSamanAvailability(centers, samanData);
    expect(enriched[0].freeturn_text).toBeTruthy();
  });

  it('keeps existing freeturn_text from full-profile', () => {
    const centers = [{ id: 'office-1', freeturn_text: 'امروز 10:40' }];
    const samanData = {
      centers: [
        {
          id: 'office-1',
          availability_status: {
            booking_available: true,
            nearest_time_slot: '2026-08-19T12:00:00.000Z',
          },
        },
      ],
    } as any;

    const enriched = enrichProfileCentersWithSamanAvailability(centers, samanData);
    expect(enriched[0].freeturn_text).toBe('امروز 10:40');
  });
});

describe('mapSamanAvailabilityToCenters', () => {
  it('keeps center active when booking opens later (future available_time)', () => {
    const centers = [{ id: '417', name: 'کلینیک ویژه اخوان' }];
    const samanData = {
      centers: [
        {
          id: '417',
          availability_status: {
            booking_available: false,
            nearest_time_slot: '2026-09-09T07:36:00.000+03:30',
            nearest_available_time: '2026-09-08T11:00:00.000+03:30',
          },
        },
      ],
    } as any;

    const mapped = mapSamanAvailabilityToCenters(centers, samanData);
    expect(mapped[0].is_active).toBe(true);
    expect(mapped[0].freeturns_info).toHaveLength(1);
    expect(mapped[0].freeturns_info[0].available_time).toBe(
      Math.floor(new Date('2026-09-08T11:00:00.000+03:30').getTime() / 1000),
    );
  });

  it('marks center inactive when there is no bookable window', () => {
    const centers = [{ id: '417', name: 'کلینیک ویژه اخوان' }];
    const samanData = {
      centers: [
        {
          id: '417',
          availability_status: {
            booking_available: false,
            nearest_time_slot: null,
            nearest_available_time: null,
          },
        },
      ],
    } as any;

    const mapped = mapSamanAvailabilityToCenters(centers, samanData);
    expect(mapped[0].is_active).toBe(false);
    expect(mapped[0].freeturns_info).toEqual([]);
  });

  it('marks center active when booking is available now', () => {
    const centers = [{ id: '416', name: 'بیمارستان نقوی کاشان' }];
    const samanData = {
      centers: [
        {
          id: '416',
          availability_status: {
            booking_available: true,
            nearest_time_slot: '2026-09-09T07:35:00.000+03:30',
            nearest_available_time: '2026-09-08T06:00:00.000+03:30',
          },
        },
      ],
    } as any;

    const mapped = mapSamanAvailabilityToCenters(centers, samanData);
    expect(mapped[0].is_active).toBe(true);
    expect(mapped[0].freeturns_info).toEqual([]);
  });
});
