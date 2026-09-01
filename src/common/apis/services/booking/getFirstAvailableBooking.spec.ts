import {
  FIRST_AVAILABLE_BOOKING_STATUS,
  FIRST_AVAILABLE_BOOKING_TYPE,
  getFirstAvailableBooking,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';

jest.mock('@/common/apis/client', () => ({
  apiGatewayClient: {
    post: jest.fn(),
  },
}));

const { apiGatewayClient } = jest.requireMock('@/common/apis/client') as {
  apiGatewayClient: { post: jest.Mock };
};

describe('getFirstAvailableBooking', () => {
  beforeEach(() => {
    apiGatewayClient.post.mockReset();
    apiGatewayClient.post.mockResolvedValue({ data: { status: FIRST_AVAILABLE_BOOKING_STATUS.SUCCESS } });
  });

  it('posts center_id, service_id, user_center_id and type=7 as form fields', async () => {
    await getFirstAvailableBooking({
      center_id: '5532',
      service_id: '100',
      user_center_id: '200',
    });

    expect(apiGatewayClient.post).toHaveBeenCalledTimes(1);
    const [path, body] = apiGatewayClient.post.mock.calls[0];
    expect(path).toBe('/api/bookings/first-available');
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('center_id')).toBe('5532');
    expect(body.get('service_id')).toBe('100');
    expect(body.get('user_center_id')).toBe('200');
    expect(body.get('type')).toBe(String(FIRST_AVAILABLE_BOOKING_TYPE));
  });
});

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
