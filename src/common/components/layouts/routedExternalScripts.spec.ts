import { isRetiredScript } from './RoutedExternalScripts';

describe('isRetiredScript', () => {
  it('اسکریپتِ حضورِ پزشک دیگر تزریق نمی‌شود — کارش بومی شده', () => {
    expect(isRetiredScript('https://hami.paziresh24.com/scripts/search-cards-presence.js')).toBe(true);
  });

  it('عوض‌شدنِ هاست یا query string دورش نمی‌زند', () => {
    expect(isRetiredScript('https://example.com/scripts/search-cards-presence.js?v=2')).toBe(true);
  });

  it('بقیه‌ی اسکریپت‌ها دست‌نخورده می‌مانند', () => {
    expect(isRetiredScript('https://hami.paziresh24.com/scripts/other.js')).toBe(false);
    expect(isRetiredScript('not-a-url')).toBe(false);
  });
});
