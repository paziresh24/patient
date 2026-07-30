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

export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    if (!isProductionTarget(baseURL)) {
      for (const pattern of THIRD_PARTY_BLOCKLIST) {
        await page.route(pattern, route => route.abort());
      }
    }
    await use(page);
  },
});

export { expect };
