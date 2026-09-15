import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { DoctorProfilePage } from '../pages/doctor-profile.page';
import { SearchPage } from '../pages/search.page';
import { FULL_FLOW_SKIP, shouldRunFullFlows } from '../support/capabilities';

/**
 * مسیرِ بحرانی #۲ — پروفایلِ پزشک.
 *
 * پزشکِ هدف از نتایجِ زنده انتخاب می‌شود (نه هاردکد). چون بخشی از اجزای صفحه **داده-وابسته**‌اند
 * (هر پزشکی «برنامه کاری» یا نظر ندارد)، تست روی چند کاندید حلقه می‌زند و ادعایش این است:
 * «صفحه‌ی پروفایل برای حداقل یکی از پزشکانِ واقعیِ نتایج، **کامل** رندر می‌شود».
 * همین برای گاردِ hydration کافی است و با عوض‌شدنِ دیتا به‌دروغ قرمز نمی‌شود.
 */
test.describe('پروفایلِ پزشک', () => {
  test('اجزای حیاتیِ صفحه رندر می‌شوند (نام، نظرات، برنامه‌ی کاری، دکمه‌ی نوبت)', async ({ page, baseURL }) => {
    test.skip(!shouldRunFullFlows(baseURL), FULL_FLOW_SKIP);

    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();

    const candidates = (await search.uniqueDoctorLinks()).slice(0, 8);
    const profile = new DoctorProfilePage(page);
    const tried: string[] = [];

    for (const href of candidates) {
      await profile.goto(href);
      tried.push(href);
      if (await profile.isFullyRendered()) {
        // برای این پزشک همه‌چیز حاضر است ⇒ assertهای صریح تا خطا خوانا باشد.
        await profile.expectRendered();
        await profile.expectReviewsSection();
        return;
      }
    }

    expect(
      false,
      `هیچ‌کدام از ${tried.length} پزشکِ اولِ نتایج پروفایلِ کامل رندر نکردند:\n${tried.join('\n')}`,
    ).toBe(true);
  });
});
