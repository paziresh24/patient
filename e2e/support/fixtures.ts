import { test as base, expect } from '@playwright/test';
import { THIRD_PARTY_BLOCKLIST } from '../../playwright.config';

/**
 * fixtureِ مشترکِ تست‌ها.
 *
 * تنها کارش این است: وقتی هدف **production نیست** (یعنی buildِ لوکال یا استیجینگ)، اسکریپت‌های
 * third-party را بلاک می‌کند. دلیلِ اندازه‌گیری‌شده‌اش در `playwright.config.ts` نوشته شده:
 * آن اسکریپت‌ها روی localhost خطا می‌دهند و hydration را نصفه می‌گذارند، پس تست‌ها به‌دروغ
 * قرمز می‌شوند.
 *
 * روی production هیچ‌چیز بلاک نمی‌شود — چون آن‌جا می‌خواهیم **همان تجربه‌ی واقعیِ کاربر** سنجیده
 * شود، با همه‌ی اسکریپت‌هایش.
 */
const isProductionTarget = (baseURL?: string) => !!baseURL && /(^https:\/\/(www\.)?paziresh24\.com)/.test(baseURL);

/**
 * روی هدفِ غیر-production، پاسخِ APIهای cross-originِ **خودمان** با هدرِ CORS بازنویسی می‌شود.
 *
 * چرا لازم شد (اندازه‌گیری‌شده در CI، pipeline 3730): کانتینرِ همین MR روی `http://app:3000`
 * بالا می‌آید، ولی `CLINIC_BASE_URL` همچنان `https://www.paziresh24.com` است. مرورگر خودِ
 * درخواست را می‌فرستد و پاسخ هم می‌آید، ولی چون `Access-Control-Allow-Origin` فقط originهای
 * واقعیِ ما را مجاز می‌کند، مرورگر پاسخ را دور می‌ریزد ⇒ `getbaseinfo` خالی می‌ماند ⇒ چیپِ شهر
 * («تهران») هیچ‌وقت رندر نمی‌شود ⇒ دو تستِ دیالوگِ شهر قرمزِ **کاذب** می‌دادند، درحالی‌که همان
 * تست‌ها علیهِ production سبزند.
 *
 * چرا این «پنهان‌کردنِ باگ» نیست: چیزی که خنثی می‌شود سیاستِ origin مرورگر است، نه کدِ محصول —
 * پاسخِ واقعیِ همان API با `route.fetch()` گرفته می‌شود و دست نمی‌خورد؛ فقط هدرِ ACAO اضافه
 * می‌شود. اگر خودِ API بشکند یا داده‌اش عوض شود، تست همچنان قرمز می‌شود.
 *
 * ⛔ عمداً فقط روی هدفِ غیر-production: روی production هیچ بازنویسیِ هدری انجام نمی‌شود.
 */
const OWN_API_CORS_PATTERNS = ['**/api/getbaseinfo**'];

export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    if (!isProductionTarget(baseURL)) {
      for (const pattern of THIRD_PARTY_BLOCKLIST) {
        await page.route(pattern, route => route.abort());
      }
      for (const pattern of OWN_API_CORS_PATTERNS) {
        await page.route(pattern, async route => {
          try {
            const response = await route.fetch();
            const headers = {
              ...response.headers(),
              'access-control-allow-origin': new URL(page.url() || baseURL!).origin,
              'access-control-allow-credentials': 'true',
              'access-control-allow-headers': '*',
              'access-control-allow-methods': 'GET,POST,OPTIONS',
            };
            await route.fulfill({ response, headers });
          } catch {
            // شکستِ واقعیِ شبکه را قورت نمی‌دهیم؛ می‌گذاریم درخواست عادی برود و تست ببیندش.
            await route.continue();
          }
        });
      }
    }
    await use(page);
  },
});

export { expect };
