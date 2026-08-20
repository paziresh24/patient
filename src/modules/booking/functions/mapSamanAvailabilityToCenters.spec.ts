import { enrichProfileCentersWithSamanAvailability } from './mapSamanAvailabilityToCenters';

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
