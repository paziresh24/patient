import { isPWA } from '@/common/utils/isPwa';

export type BrowserType =
  | 'pwa-android'
  | 'chrome'
  | 'edge'
  | 'firefox'
  | 'safari'
  | 'android-chrome'
  | 'other';

export interface BrowserGuide {
  title: string;
  steps: string[];
}

export const getBrowserType = (): BrowserType => {
  if (typeof navigator === 'undefined') return 'other';

  if (isPWA()) {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'pwa-android';
  }

  const ua = navigator.userAgent;
  if (/Android/i.test(ua) && ua.includes('Chrome') && !ua.includes('Edg')) return 'android-chrome';
  if (ua.includes('Edg/')) return 'edge';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'chrome';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  return 'other';
};

export const BROWSER_GUIDES: Record<BrowserType, BrowserGuide> = {
  'pwa-android': {
    title: 'اپ نصب‌شده (PWA/TWA)',
    steps: [
      'آیکون اپ را روی صفحه اصلی طولانی فشار دهید (long-press)',
      '«تنظیمات سایت» یا «Site settings» را انتخاب کنید',
      'روی «اعلان‌ها» یا «Notifications» بزنید',
      '«نمایش اعلان» یا «Show notifications» را روشن کنید',
      'اپ را کامل ببندید و دوباره باز کنید',
    ],
  },
  'android-chrome': {
    title: 'Chrome در اندروید',
    steps: [
      'روی آیکون شبیه تنظیمات یا اطلاعات صفحه (سمت چپ نوار آدرس) بزنید',
      '«مجوزها» یا «Permissions» را انتخاب کنید',
      'کنار «اعلان‌ها» گزینه «مجاز» یا «Allow» را انتخاب کنید',
      'در صورت نیاز تب را ببندید و سایت را دوباره باز کنید',
    ],
  },
  chrome: {
    title: 'مرورگر Chrome',
    steps: [
      'کلیک روی آیکون قفل 🔒 در نوار آدرس (سمت چپ)',
      'پیدا کردن گزینه «اعلان‌ها» یا Notifications',
      'تغییر وضعیت به «مجاز» یا Allow',
      'رفرش کردن صفحه (F5 یا Ctrl+R)',
    ],
  },
  edge: {
    title: 'مرورگر Edge',
    steps: [
      'کلیک روی آیکون قفل 🔒 در نوار آدرس (سمت چپ)',
      'پیدا کردن گزینه «اعلان‌ها» یا Notifications',
      'تغییر وضعیت به «مجاز» یا Allow',
      'رفرش کردن صفحه (F5 یا Ctrl+R)',
    ],
  },
  firefox: {
    title: 'مرورگر Firefox',
    steps: [
      'کلیک روی آیکون قفل 🔒 در نوار آدرس',
      'کلیک روی «اطلاعات بیشتر»',
      'رفتن به تب «مجوزها»',
      'فعال کردن گزینه «اعلان‌ها»',
      'رفرش کردن صفحه (F5 یا Ctrl+R)',
    ],
  },
  safari: {
    title: 'مرورگر Safari',
    steps: [
      'رفتن به منوی Safari > تنظیمات (Preferences)',
      'انتخاب تب «وب‌سایت‌ها» (Websites)',
      'انتخاب «اعلان‌ها» (Notifications) از ستون چپ',
      'انتخاب «مجاز» (Allow) برای این وب‌سایت',
      'رفرش کردن صفحه',
    ],
  },
  other: {
    title: 'تنظیمات مرورگر',
    steps: [
      'آیکون قفل 🔒 یا اطلاعات سایت را در نوار آدرس پیدا کنید',
      'بخش مجوزها یا Permissions را باز کنید',
      'اعلان‌ها (Notifications) را روی «مجاز» قرار دهید',
      'صفحه را رفرش کنید',
    ],
  },
};
