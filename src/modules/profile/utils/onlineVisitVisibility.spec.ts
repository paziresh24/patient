import { CENTERS } from '@/common/types/centers';
import {
  getProfileOnlineVisitVisibility,
  hasBookableOnlineVisitCenter,
  isLegacyConsultActiveBookingEnabled,
  shouldShowProfileOnlineVisit,
} from './onlineVisitVisibility';

const samanOnlineAvailable = {
  online_visit_availability: {
    booking_available: true,
    nearest_time_slot: null,
    nearest_available_time: '2026-07-27T00:00:00.000+03:30',
  },
  centers: [
    {
      id: CENTERS.CONSULT,
      availability_status: {
        booking_available: true,
        nearest_time_slot: null,
        nearest_available_time: '2026-07-27T00:00:00.000+03:30',
      },
    },
  ],
} as any;

const samanOnlineUnavailable = {
  online_visit_availability: {
    booking_available: false,
    nearest_time_slot: null,
    nearest_available_time: '2026-08-01T00:00:00.000+03:30',
  },
  centers: [
    {
      id: CENTERS.CONSULT,
      availability_status: {
        booking_available: false,
        nearest_time_slot: null,
        nearest_available_time: '2026-08-01T00:00:00.000+03:30',
      },
    },
  ],
} as any;

describe('onlineVisitVisibility', () => {
  it('detects bookable online visit center from centers list', () => {
    expect(hasBookableOnlineVisitCenter([{ id: CENTERS.CONSULT }])).toBe(true);
    expect(hasBookableOnlineVisitCenter([{ id: 5532 as any }])).toBe(true);
    expect(hasBookableOnlineVisitCenter([{ id: '123' }])).toBe(false);
  });

  it('keeps legacy consult gate helper for rollback', () => {
    expect(isLegacyConsultActiveBookingEnabled({ enabled: false })).toBe(false);
    expect(isLegacyConsultActiveBookingEnabled({ enabled: true })).toBe(true);
  });

  it('online+presence: shows when 5532 + Saman online available even if consult_active_booking is false', () => {
    expect(
      shouldShowProfileOnlineVisit({
        centers: [{ id: CENTERS.CONSULT }, { id: 'office-1' }],
        onlineVisit: { enabled: false },
        samanLoaded: true,
        samanData: samanOnlineAvailable,
      }),
    ).toBe(true);
  });

  it('online only: shows when only 5532 is present and Saman online available', () => {
    expect(
      shouldShowProfileOnlineVisit({
        centers: [{ id: CENTERS.CONSULT }],
        onlineVisit: { enabled: true },
        samanLoaded: true,
        samanData: samanOnlineAvailable,
      }),
    ).toBe(true);
  });

  it('presence only: hides when centers API has no 5532', () => {
    expect(
      shouldShowProfileOnlineVisit({
        centers: [{ id: 'office-1' }],
        onlineVisit: { enabled: true },
        samanLoaded: true,
        samanData: samanOnlineAvailable,
      }),
    ).toBe(false);
  });

  it('hides when Saman says online booking is unavailable', () => {
    expect(
      shouldShowProfileOnlineVisit({
        centers: [{ id: CENTERS.CONSULT }],
        onlineVisit: { enabled: true },
        samanLoaded: true,
        samanData: samanOnlineUnavailable,
      }),
    ).toBe(false);
  });

  it('shows optimistically while Saman is not loaded yet if 5532 exists', () => {
    expect(
      shouldShowProfileOnlineVisit({
        centers: [{ id: CENTERS.CONSULT }],
        onlineVisit: { enabled: false },
        samanLoaded: false,
        samanData: undefined,
      }),
    ).toBe(true);
  });

  it('none/referral: hides when neither 5532 nor Saman online apply', () => {
    expect(
      shouldShowProfileOnlineVisit({
        centers: [],
        onlineVisit: { enabled: false },
        samanLoaded: false,
        samanData: undefined,
      }),
    ).toBe(false);
  });

  it('exposes visibility reason for Splunk', () => {
    expect(
      getProfileOnlineVisitVisibility({
        centers: [],
        samanLoaded: false,
        samanData: undefined,
      }).reason,
    ).toBe('no_bookable_5532');

    expect(
      getProfileOnlineVisitVisibility({
        centers: [{ id: CENTERS.CONSULT }],
        samanLoaded: false,
        samanData: undefined,
      }).reason,
    ).toBe('shown_pending_saman');

    expect(
      getProfileOnlineVisitVisibility({
        centers: [{ id: CENTERS.CONSULT }],
        samanLoaded: true,
        samanData: samanOnlineUnavailable,
      }).reason,
    ).toBe('saman_unavailable');

    expect(
      getProfileOnlineVisitVisibility({
        centers: [{ id: CENTERS.CONSULT }],
        samanLoaded: true,
        samanData: samanOnlineAvailable,
      }).reason,
    ).toBe('shown');
  });
});
