import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { AUTH_STATE_PATH } from '../support/auth';

/**
 * گرفتنِ یک‌باره‌ی sessionِ لاگین‌شده — چون OTP قابلِ (و شایسته‌ی) اتوماسیون نیست.
 *
 * اجرا:  npm run e2e:login
 * مرورگر headed باز می‌شود و Playwright Inspector مکث می‌کند؛ **خودت** با حسابِ تست لاگین کن
 * (شماره + کدِ پیامکی)، بعد در Inspector دکمه‌ی ▶ Resume را بزن. کوکی/localStorage در
 * `e2e/.auth/user.json` ذخیره می‌شود (gitignored) و همه‌ی تست‌های نیازمندِ لاگین از آن استفاده
 * می‌کنند تا وقتی session منقضی شود (آن‌وقت همین دستور را دوباره بزن).
 *
 * چرا `page.pause()` و نه انتظارِ زمانی: هیچ حدسی درباره‌ی مدتِ رسیدنِ پیامک نمی‌زنیم؛ کنترل
 * دستِ آدم است.
 */
test('capture login state', async ({ page, context }) => {
  test.setTimeout(10 * 60_000);

  await page.goto('/login/', { waitUntil: 'domcontentloaded' }).catch(() => page.goto('/'));

  // eslint-disable-next-line no-console
  console.log('\n▶ با حسابِ تست لاگین کن، بعد در Playwright Inspector دکمه‌ی Resume را بزن.\n');
  await page.pause();

  fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });
  await context.storageState({ path: AUTH_STATE_PATH });

  // گاردِ حداقلی: اگر واقعاً لاگین نشده باشی، فایلِ بی‌ارزش ذخیره نکنیم.
  const state = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, 'utf8'));
  const hasSomething =
    (state.cookies?.length ?? 0) > 0 || (state.origins?.[0]?.localStorage?.length ?? 0) > 0;
  expect(hasSomething, 'هیچ کوکی/استوریجی ذخیره نشد — احتمالاً لاگین کامل نشده بود').toBe(true);

  // eslint-disable-next-line no-console
  console.log(`✓ session ذخیره شد: ${AUTH_STATE_PATH}`);
});
