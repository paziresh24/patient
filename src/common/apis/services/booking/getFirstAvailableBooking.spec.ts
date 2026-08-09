import {
  FIRST_AVAILABLE_BOOKING_STATUS,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';

describe('mapFirstAvailableFreeturnMs', () => {
  it('returns milliseconds when status is success and from is valid', () => {
    expect(
      mapFirstAvailableFreeturnMs({
        status: FIRST_AVAILABLE_BOOKING_STATUS.SUCCESS,
        result: {
          free_turn: {
            from: 1784611800,
            to: 1784613600,
            rebook: false,
          },
        },
      }),
    ).toBe(1784611800 * 1000);
  });

  it('returns null when there is no free turn', () => {
    expect(
      mapFirstAvailableFreeturnMs({
        status: FIRST_AVAILABLE_BOOKING_STATUS.NO_FREE_TURN,
        message: 'There is no free turn',
      }),
    ).toBeNull();
  });

  it('returns null when from is missing or invalid', () => {
    expect(
      mapFirstAvailableFreeturnMs({
        status: FIRST_AVAILABLE_BOOKING_STATUS.SUCCESS,
        result: {},
      }),
    ).toBeNull();
  });
});
