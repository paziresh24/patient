/**
 * یارا — چیزهایی که فقط یک مرورگرِ واقعی می‌تواند اثبات کند.
 *
 * ۱۱۴ تستِ واحدِ `src/modules/chat` منطق را می‌پوشانند و هیچ‌کدام سه باگی که owner
 * در ۲۰۲۶-۰۸-۰۷ گزارش کرد را نمی‌گرفتند، چون هر سه **layout و ناوبری**اند:
 *
 *   • کادرِ گفت‌وگو با زیادشدنِ گفت‌وگوهای کناری می‌رفت زیرِ لبه‌ی صفحه — jsdom
 *     ارتفاع ندارد، پس این کلاس در تستِ واحد **ساختاراً** نامرئی است.
 *   • بکِ مرورگر thread را برمی‌گرداند ولی فهرستِ نوبت‌ها را نه.
 *   • دکمه‌های کارت باید به مرحله‌ی رزرو بروند، نه به پروفایل.
 *
 * ⛔ این‌جا هیچ turnی به khesht زده نمی‌شود مگر تستی که صریحاً برایش نوشته شده:
 *   یک testِ CI که هر بار به LLM بزند، هم پول می‌سوزاند هم قرمزیِ ناپایدار
 *   می‌سازد. پاسخ‌ها با `page.route` قلاب می‌شوند و همان مسیرِ رندرِ واقعی اجرا
 *   می‌شود — چیزی که سنجیده می‌شود *چیدمان و ناوبری* است، نه کیفیتِ مدل. سلامتِ
 *   خودِ khesht مانیتورِ جدا دارد (`scripts/setup-uptime-kuma-chat.py`).
 */
import { expect, test } from '@playwright/test';
import { AUTH_STATE_PATH, NEEDS_LOGIN, hasAuthState } from '../support/auth';

test.describe('یارا', () => {
  test.skip(!hasAuthState(), NEEDS_LOGIN);
  test.use({ storageState: AUTH_STATE_PATH });

  /** پاسخِ ثابت با سه کارت — تا رندر قابلِ ادعا باشد و به مدل وابسته نباشد. */
  const cannedTurn = {
    mode: 'chat',
    conversation_id: 'e2e-1',
    query_id: 'E2E1',
    turn_index: 1,
    message: 'این پزشکان را پیشنهاد می‌کنم.',
    results: [
      {
        id: 'd1',
        title: 'دکتر آزمون یک',
        expertise: 'ارتوپدی',
        url: '/dr/dr-azmoon-yek/',
        type: 'doctor',
        position: 1,
        online_visit: true,
        online_visit_price: 303000,
        in_person_center_id: 'center-abc',
      },
    ],
    suggestions: [{ key: 'change_city', label: 'تغییر شهر' }],
  };

  const stubTurn = async (page: import('@playwright/test').Page) => {
    await page.route('**/api/khesht/chat/turn', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(cannedTurn) })
    );
    // رویدادهای آنالیتیکس نباید تست را کند یا قرمز کنند.
    await page.route('**/api/khesht/chat/events', route => route.fulfill({ status: 202, body: '{}' }));
  };

  /** فهرستِ کناریِ عمداً بلند — همان شرایطی که کادر را پایین می‌راند. */
  const stubManyConversations = async (page: import('@playwright/test').Page, n = 40) => {
    const rows = Array.from({ length: n }, (_, i) => ({
      conversation_id: `c-${i}`,
      title: `گفت‌وگوی آزمایشی شماره ${i}`,
      turn_count: 2,
      created_at: new Date(Date.now() - i * 3600_000).toISOString(),
      last_message_at: new Date(Date.now() - i * 3600_000).toISOString(),
    }));
    await page.route('**/api/khesht/chat/conversations', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ conversations: rows }) })
    );
  };

  test('صفحه بالا می‌آید و کادرِ گفت‌وگو در دسترس است', async ({ page }) => {
    await stubTurn(page);
    await page.goto('/yara/');
    const composer = page.getByLabel('پیام شما به یارا');
    await expect(composer).toBeVisible({ timeout: 30_000 });
    // اگر گیت ببندد، این متن می‌آید — یعنی رگرسیونِ دسترسی، نه شکستِ رندر.
    await expect(page.getByTestId('yara-unavailable')).toHaveCount(0);
  });

  test('کادر با فهرستِ بلندِ گفت‌وگوها هم به پایینِ صفحه چسبیده می‌ماند', async ({ page }) => {
    /**
     * ادعای اصلی: **بدونِ اسکرول** کادر داخلِ viewport باشد. نسخه‌ی قبلی ارتفاع
     * را با `calc(100dvh - 8rem)` حدس می‌زد و با فهرستِ بلند، صفحه اسکرول می‌گرفت
     * و کادر می‌رفت زیرِ لبه.
     */
    await stubTurn(page);
    await stubManyConversations(page);
    await page.goto('/yara/');
    const composer = page.getByLabel('پیام شما به یارا');
    await expect(composer).toBeVisible({ timeout: 30_000 });

    const box = await composer.boundingBox();
    const viewport = page.viewportSize();
    expect(box, 'کادر اندازه‌پذیر نیست').not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.y + box!.height, 'کادر زیرِ لبه‌ی صفحه رفته است').toBeLessThanOrEqual(viewport!.height + 1);

    // و خودِ صفحه نباید اسکرولِ عمودی داشته باشد؛ اسکرول مالِ ستون‌هاست.
    const pageScrolls = await page.evaluate(
      () => document.documentElement.scrollHeight > document.documentElement.clientHeight + 2
    );
    expect(pageScrolls, 'کلِ صفحه اسکرول می‌گیرد — ارتفاعِ پوسته درست محاسبه نشده').toBe(false);
  });

  test('دکمه‌های کارت به مرحله‌ی رزرو می‌روند، نه به پروفایل', async ({ page }) => {
    await stubTurn(page);
    await page.goto('/yara/');
    const composer = page.getByLabel('پیام شما به یارا');
    await expect(composer).toBeVisible({ timeout: 30_000 });
    await composer.fill('گردنم درد می‌کند و نمی‌دانم به چه دکتری مراجعه کنم');
    await composer.press('Enter');

    await expect(page.getByTestId('yara-result-card').first()).toBeVisible({ timeout: 20_000 });
    // ناوبری قلاب می‌شود تا تست واقعاً به صفحه‌ی رزرو نرود — چیزی که سنجیده
    // می‌شود «کجا می‌فرستد» است، نه صفحه‌ی مقصد.
    const target = await page.evaluate(() => {
      const w = window as unknown as { __yaraNav?: string };
      Object.defineProperty(window.location, 'href', {
        configurable: true,
        set(v: string) {
          w.__yaraNav = v;
        },
        get: () => '',
      });
      return true;
    });
    expect(target).toBe(true);
    await page.getByRole('button', { name: 'ویزیت آنلاین' }).first().click();
    const nav = await page.evaluate(() => (window as unknown as { __yaraNav?: string }).__yaraNav ?? '');
    expect(nav, 'دکمه به پروفایل می‌رود نه به مرحله‌ی رزرو').toContain('/booking/');
    expect(nav).toContain('centerId=');
  });

  test('بکِ مرورگر گفت‌وگو را برمی‌گرداند — نه اینکه از یارا بیرون بیندازد', async ({ page }) => {
    await stubTurn(page);
    await page.goto('/yara/');
    const composer = page.getByLabel('پیام شما به یارا');
    await expect(composer).toBeVisible({ timeout: 30_000 });
    await composer.fill('گردنم درد می‌کند و نمی‌دانم به چه دکتری مراجعه کنم');
    await composer.press('Enter');
    await expect(page.getByTestId('yara-result-card').first()).toBeVisible({ timeout: 20_000 });

    // به پروفایلِ یک پزشک برو و برگرد — سناریوی دقیقِ گزارشِ owner.
    await page.goto('/dr/dr-azmoon-yek/');
    await page.goBack();

    await expect(page).toHaveURL(/\/yara/);
    // thread باید سرِ جایش باشد، نه صفحه‌ی خانه‌ی خالی.
    await expect(page.getByTestId('yara-result-card').first()).toBeVisible({ timeout: 20_000 });
  });
});
