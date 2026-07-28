// regression گارد برای فیکسِ perf (DR-08، docs/dev-requests/dr-08-listing-pagespeed.md §۱۱): قبل از
// فیکس، `firebase/analytics` و `./config` (که initializeApp می‌زند) import استاتیک بودند — یعنی
// همیشه bundle/execute می‌شدند، حتی وقتی isPWA() فالس است. این تست تضمین می‌کند که در حالتِ غیر-PWA
// هیچ‌کدام از توابعِ سنگینِ firebase (isSupported/getAnalytics) هرگز صدا زده نمی‌شوند — یعنی گیت
// واقعاً *importِ* ماژول را کنترل می‌کند، نه فقط فراخوانیِ تابع را.

const mockIsSupported = jest.fn();
const mockGetAnalytics = jest.fn();

jest.mock('@/common/utils/isPwa', () => ({ isPWA: jest.fn() }));
jest.mock('next/config', () => () => ({ publicRuntimeConfig: { IS_FIREBASE_ENABLE: true } }));
jest.mock('firebase/analytics', () => ({
  isSupported: () => mockIsSupported(),
  getAnalytics: (app: unknown) => mockGetAnalytics(app),
}));
jest.mock('./config', () => ({ __esModule: true, default: 'fake-firebase-app' }));

describe('firebase/analytics — gate باید importِ سنگین را کنترل کند، نه فقط فراخوانیِ تابع', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('وقتی isPWA()=false است، isSupported/getAnalytics هرگز صدا زده نمی‌شوند و نتیجه null است', async () => {
    const { isPWA } = require('@/common/utils/isPwa');
    (isPWA as jest.Mock).mockReturnValue(false);

    const analytics = require('./analytics').default;
    const result = await analytics;

    expect(result).toBeNull();
    expect(mockIsSupported).not.toHaveBeenCalled();
    expect(mockGetAnalytics).not.toHaveBeenCalled();
  });

  it('وقتی isPWA()=true و isSupported()=true است، getAnalytics با app صدا زده می‌شود', async () => {
    const { isPWA } = require('@/common/utils/isPwa');
    (isPWA as jest.Mock).mockReturnValue(true);
    mockIsSupported.mockResolvedValue(true);
    mockGetAnalytics.mockReturnValue('fake-analytics-instance');

    const analytics = require('./analytics').default;
    const result = await analytics;

    expect(mockGetAnalytics).toHaveBeenCalledWith('fake-firebase-app');
    expect(result).toBe('fake-analytics-instance');
  });

  it('وقتی isPWA()=true ولی isSupported()=false است، نتیجه null است و getAnalytics صدا زده نمی‌شود', async () => {
    const { isPWA } = require('@/common/utils/isPwa');
    (isPWA as jest.Mock).mockReturnValue(true);
    mockIsSupported.mockResolvedValue(false);

    const analytics = require('./analytics').default;
    const result = await analytics;

    expect(result).toBeNull();
    expect(mockGetAnalytics).not.toHaveBeenCalled();
  });
});
