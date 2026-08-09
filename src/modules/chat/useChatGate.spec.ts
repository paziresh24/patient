import { chatIneligibleReason, chatRouteAllowed , isAllowedUserId } from './chatEligibility';

/**
 * These lock in the fix for a trap that would have shipped the feature
 * permanently dark: the client-side flag used to be `NEXT_PUBLIC_CHAT_MVP_ENABLED`,
 * but the Dockerfile runs `npm run build` with no build args, so any NEXT_PUBLIC_*
 * read from the browser bundle inlines as `undefined` in production.
 */
describe('DR-11 — کلیدِ رول‌اوت باید runtime باشد نه build-time', () => {
  it('گیتِ روتِ /chat روی env سرور کار می‌کند و نامِ قدیمی را هم می‌پذیرد', () => {
    expect(chatRouteAllowed({ CHAT_MVP_ENABLED: 'true' }, undefined)).toBe(true);
    // نامِ قدیمی نباید یک‌شبه بشکند
    expect(chatRouteAllowed({ NEXT_PUBLIC_CHAT_MVP_ENABLED: 'true' }, undefined)).toBe(true);
    expect(chatRouteAllowed({}, undefined)).toBe(false);
  });

  it('کلیدِ preview فقط با مقدارِ درست باز می‌کند', () => {
    expect(chatRouteAllowed({ CHAT_MVP_PREVIEW_KEY: 'k1' }, 'k1')).toBe(true);
    expect(chatRouteAllowed({ CHAT_MVP_PREVIEW_KEY: 'k1' }, 'wrong')).toBe(false);
    // کلیدِ خالی نباید همه را راه بدهد
    expect(chatRouteAllowed({ CHAT_MVP_PREVIEW_KEY: '' }, '')).toBe(false);
    expect(chatRouteAllowed({}, undefined)).toBe(false);
  });
});

describe('DR-11 — preview فقط درصدِ رول‌اوت را دور می‌زند، نه گاردهای ایمنی', () => {
  // ترکیبی که useChatGate می‌سازد: featureEnabled = master && (rollout || preview)
  const gate = (o: { master: boolean; rollout: boolean; preview: boolean; host?: string; isLogin?: boolean }) =>
    chatIneligibleReason({
      host: o.host ?? 'paziresh24.com',
      partnerKey: '',
      isLogin: o.isLogin ?? true,
      isAuthPending: false,
      featureEnabled: o.master && (o.rollout || o.preview),
      isProduction: true,
    });

  it('با preview، حتی وقتی رول‌اوت صفر است، owner می‌تواند ببیند', () => {
    expect(gate({ master: true, rollout: false, preview: true })).toBeNull();
  });

  it('preview گاردِ هاست را دور نمی‌زند — روی سایتِ دانشگاه هیچ‌وقت باز نمی‌شود', () => {
    expect(gate({ master: true, rollout: true, preview: true, host: 'nobat.tums.ac.ir' })).toBe('host_not_allowed');
  });

  it('preview گاردِ لاگین را دور نمی‌زند (کنترلِ هزینه)', () => {
    expect(gate({ master: true, rollout: true, preview: true, isLogin: false })).toBe('not_logged_in');
  });

  it('کلیدِ masterِ خاموش بر همه‌چیز مقدم است — حتی preview', () => {
    expect(gate({ master: false, rollout: true, preview: true })).toBe('feature_off');
  });

  it('رول‌اوتِ خاموش + بدونِ preview ⇒ چیزی نمایش داده نمی‌شود', () => {
    expect(gate({ master: true, rollout: false, preview: false })).toBe('feature_off');
  });
});

describe('DR-11 §۱۳.۷ — bypassِ dev-onlyِ لاگین ساختاراً در production بی‌اثر است', () => {
  const { devFakeLogin } = require('./chatEligibility');

  it('فقط در development و فقط با env صریح روشن می‌شود', () => {
    expect(devFakeLogin({ CHAT_MVP_DEV_FAKE_LOGIN: 'true' }, 'development')).toBe(true);
  });

  it('در production/test حتی با env روشن، خاموش است', () => {
    expect(devFakeLogin({ CHAT_MVP_DEV_FAKE_LOGIN: 'true' }, 'production')).toBe(false);
    expect(devFakeLogin({ CHAT_MVP_DEV_FAKE_LOGIN: 'true' }, 'test')).toBe(false);
    expect(devFakeLogin({ CHAT_MVP_DEV_FAKE_LOGIN: 'true' }, undefined)).toBe(false);
  });

  it('بدونِ env، حتی در development خاموش است', () => {
    expect(devFakeLogin({}, 'development')).toBe(false);
  });
});

describe('allow-listِ حساب — جایگزینِ chatPreview برای آدمِ نام‌برده', () => {
  it('فقط idِ دقیق را می‌پذیرد، و فهرستِ خالی هیچ‌کس را باز نمی‌کند', () => {
    expect(isAllowedUserId('5050715', '5050715')).toBe(true);
    expect(isAllowedUserId('111, 5050715 ,222', '5050715')).toBe(true);
    expect(isAllowedUserId('5050715', '505071')).toBe(false);
    expect(isAllowedUserId('5050715', '50507150')).toBe(false);
    // fail-closed: نبودِ فهرست یا نبودِ کاربر ⇒ هیچ‌کس. یک allow-listِ خالی که
    // همه را راه بدهد، بدترین حالتِ ممکنِ یک گیتِ rollout است.
    expect(isAllowedUserId('', '5050715')).toBe(false);
    expect(isAllowedUserId(undefined, '5050715')).toBe(false);
    expect(isAllowedUserId('5050715', undefined)).toBe(false);
    expect(isAllowedUserId('5050715', '')).toBe(false);
  });
});
