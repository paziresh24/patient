import { getMe } from './me';

jest.mock('@/common/apis/client', () => ({
  apiGatewayClient: {
    get: jest.fn(),
  },
}));

const { apiGatewayClient } = jest.requireMock('@/common/apis/client') as {
  apiGatewayClient: { get: jest.Mock };
};

describe('getMe', () => {
  beforeEach(() => {
    apiGatewayClient.get.mockResolvedValue({ data: { users: [{ id: 1, cell: '09120000000' }] } });
  });

  it('uses the same-origin BFF in the browser', async () => {
    const user = await getMe();
    expect(apiGatewayClient.get).toHaveBeenCalledWith('/patient/api/auth/me', { baseURL: '' });
    expect(user).toEqual({ id: 1, cell: '09120000000' });
  });
});
