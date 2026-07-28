import { getConsultBannerReservedSpace, CONSULT_BANNER_RESERVED_HEIGHT_REM } from './getConsultBannerReservedSpace';

// regression گارد برای فیکسِ CLS (DR-08): اسکلتونِ ConsultBanner باید با شکلِ واقعیِ رندرشده هم‌اندازه
// باشد، نه یک عددِ ثابتِ حدسی — این تست با mutation-check قابل رد است (هرکدام از سه بازگشت را برگردان،
// تست باید قرمز شود).
describe('getConsultBannerReservedSpace — CLS regression گارد', () => {
  it('وقتی isConsult=true است، ConsultBanner چیزی رندر نمی‌کند ⇒ فضایی رزرو نمی‌شود', () => {
    expect(getConsultBannerReservedSpace({ isConsult: true, hasSelectedCategory: true })).toBe(
      `${CONSULT_BANNER_RESERVED_HEIGHT_REM.none}rem`,
    );
    expect(getConsultBannerReservedSpace({ isConsult: true, hasSelectedCategory: false })).toBe(
      `${CONSULT_BANNER_RESERVED_HEIGHT_REM.none}rem`,
    );
  });

  it('وقتی isConsult=false و selectedCategory ندارد، شکلِ ساده‌ی upsell رندر می‌شود', () => {
    expect(getConsultBannerReservedSpace({ isConsult: false, hasSelectedCategory: false })).toBe(
      `${CONSULT_BANNER_RESERVED_HEIGHT_REM.plain}rem`,
    );
  });

  it('وقتی isConsult=false و selectedCategory دارد، کارتِ غنی‌ترِ ویزیتِ آنلاین رندر می‌شود', () => {
    expect(getConsultBannerReservedSpace({ isConsult: false, hasSelectedCategory: true })).toBe(
      `${CONSULT_BANNER_RESERVED_HEIGHT_REM.withCategory}rem`,
    );
  });

  it('سه حالت سه مقدارِ متفاوت برمی‌گردانند (تشخیصِ collapse به یک مقدارِ ثابت)', () => {
    const values = new Set([
      getConsultBannerReservedSpace({ isConsult: true }),
      getConsultBannerReservedSpace({ isConsult: false, hasSelectedCategory: false }),
      getConsultBannerReservedSpace({ isConsult: false, hasSelectedCategory: true }),
    ]);
    expect(values.size).toBe(3);
  });
});
