import { hasRecentMicroservicePageView, markMicroservicePageView } from './recordMicroserviceProfilePageView';

describe('recordMicroserviceProfilePageView client dedup', () => {
  const key = 'p24_pv_ms_test-profile';

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('marks and detects recent page view within 24h', () => {
    expect(hasRecentMicroservicePageView('test-profile')).toBe(false);
    markMicroservicePageView('test-profile');
    expect(hasRecentMicroservicePageView('test-profile')).toBe(true);
    expect(sessionStorage.getItem(key)).toBeTruthy();
  });
});
