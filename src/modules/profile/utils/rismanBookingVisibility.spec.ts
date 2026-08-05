import {
  hasNativePaziresh24Booking,
  shouldShowRismanExternalBooking,
} from './rismanBookingVisibility';

const risman = { data: { destination: { platform: 'x' } } };

describe('rismanBookingVisibility', () => {
  const centers = [{ id: 'c1' }];

  it('hides Risman when Saman reports native in-person booking', () => {
    const saman = {
      in_person_availability: { booking_available: true, nearest_time_slot: null, nearest_available_time: null },
      online_visit_availability: { booking_available: false, nearest_time_slot: null, nearest_available_time: null },
      centers: [{ id: 'c1', availability_status: { booking_available: true, nearest_time_slot: null, nearest_available_time: null } }],
    };
    expect(hasNativePaziresh24Booking(centers, saman, true)).toBe(true);
    expect(shouldShowRismanExternalBooking(risman, centers, saman, true, true)).toBe(false);
  });

  it('shows Risman when Saman has no native booking even if isBulk is false', () => {
    const saman = {
      in_person_availability: { booking_available: false, nearest_time_slot: null, nearest_available_time: null },
      online_visit_availability: { booking_available: false, nearest_time_slot: null, nearest_available_time: null },
      centers: [{ id: 'c1', availability_status: { booking_available: false, nearest_time_slot: null, nearest_available_time: null } }],
    };
    expect(shouldShowRismanExternalBooking(risman, centers, saman, false, true)).toBe(true);
  });

  it('uses isBulk before Saman resolves', () => {
    expect(shouldShowRismanExternalBooking(risman, centers, undefined, true, false)).toBe(true);
    expect(shouldShowRismanExternalBooking(risman, centers, undefined, false, false)).toBe(false);
  });
});
