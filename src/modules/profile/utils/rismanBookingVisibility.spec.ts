import {
  hasNativePaziresh24Booking,
  shouldShowRismanExternalBooking,
} from './rismanBookingVisibility';

const risman = { data: { destination: { platform: 'x' } } };
const centers = [{ id: 'c1' }];

const samanBookable = {
  in_person_availability: { booking_available: true, nearest_time_slot: null, nearest_available_time: null },
  online_visit_availability: { booking_available: false, nearest_time_slot: null, nearest_available_time: null },
  centers: [{ id: 'c1', availability_status: { booking_available: true, nearest_time_slot: null, nearest_available_time: null } }],
};

const samanEmpty = {
  in_person_availability: { booking_available: false, nearest_time_slot: null, nearest_available_time: null },
  online_visit_availability: { booking_available: false, nearest_time_slot: null, nearest_available_time: null },
  centers: [{ id: 'c1', availability_status: { booking_available: false, nearest_time_slot: null, nearest_available_time: null } }],
};

describe('rismanBookingVisibility (Saman-only)', () => {
  it('hides Risman when Saman reports native booking', () => {
    expect(hasNativePaziresh24Booking(centers, samanBookable)).toBe(true);
    expect(shouldShowRismanExternalBooking(risman, centers, samanBookable, 'success')).toBe(false);
  });

  it('shows Risman when Saman has no native booking', () => {
    expect(shouldShowRismanExternalBooking(risman, centers, samanEmpty, 'success')).toBe(true);
  });

  it('hides Risman while Saman is pending (no isBulk fallback)', () => {
    expect(shouldShowRismanExternalBooking(risman, centers, undefined, 'pending')).toBe(false);
  });

  it('shows Risman on Saman error when payload exists', () => {
    expect(shouldShowRismanExternalBooking(risman, centers, undefined, 'error')).toBe(true);
  });

  it('never shows Risman without payload', () => {
    expect(shouldShowRismanExternalBooking(null, centers, samanEmpty, 'success')).toBe(false);
  });
});
