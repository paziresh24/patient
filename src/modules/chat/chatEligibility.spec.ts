import { chatIneligibleReason, isChatAllowedHost, looksConversational } from './chatEligibility';

const eligible = {
  host: 'paziresh24.com',
  partnerKey: '',
  isLogin: true,
  isAuthPending: false,
  featureEnabled: true,
  isProduction: true,
};

describe('DR-11 — گیتِ دانشگاه‌ها (خواسته‌ی صریحِ owner: «به هیچ وجه»)', () => {
  // هر هاستی که در تیکت/مکالمه اسم برده شد + خانواده‌اش. اگر این تست قرمز شد،
  // یعنی چت روی سایتِ یک دانشگاهِ طرفِ قرارداد قابلِ نمایش شده است.
  const UNIVERSITY_HOSTS = [
    'nobat.tums.ac.ir',
    'nobat.sums.ac.ir',
    'nobat.mui.ac.ir',
    'NOBAT.TUMS.AC.IR',
    'nobat.tums.ac.ir:443',
    'paziresh24.com.evil.ir',
    'sub.paziresh24.com',
    'nobat.iums.ac.ir',
  ];

  it.each(UNIVERSITY_HOSTS)('هاستِ %s هرگز مجاز نیست', host => {
    expect(isChatAllowedHost(host, true)).toBe(false);
    expect(chatIneligibleReason({ ...eligible, host })).toBe('host_not_allowed');
  });

  it('allow-list است نه blocklist — هاستِ ناشناخته هم رد می‌شود', () => {
    // دلیلِ ساختاری: partnerKey از GrowthBook با timeout ۵۰۰ms می‌آید و در صورتِ
    // شکست خالی است ⇒ blocklistِ مبتنی بر partnerKey روی همان هاست fail-open می‌شد.
    expect(isChatAllowedHost('some-partner.ir', true)).toBe(false);
    expect(chatIneligibleReason({ ...eligible, host: '', partnerKey: '' })).toBe('host_not_allowed');
  });

  it('لایه‌ی دوم: partnerKey غیرخالی روی هاستِ خودمان هم رد می‌شود', () => {
    expect(chatIneligibleReason({ ...eligible, partnerKey: 'tums' })).toBe('partner_site');
  });

  it('کنترلِ مثبت: هاستِ خودمان مجاز است (وگرنه تستِ بالا بی‌معنی بود)', () => {
    expect(isChatAllowedHost('paziresh24.com', true)).toBe(true);
    expect(isChatAllowedHost('www.paziresh24.com', true)).toBe(true);
    expect(chatIneligibleReason(eligible)).toBeNull();
  });

  it('هاست‌های dev فقط بیرونِ production مجازند', () => {
    expect(isChatAllowedHost('localhost:3000', false)).toBe(true);
    expect(isChatAllowedHost('localhost:3000', true)).toBe(false);
    expect(isChatAllowedHost('j-n-patient.p24cloud.ir', true)).toBe(false);
  });
});

describe('DR-11 — رول‌اوتِ اولیه فقط برای کاربرانِ لاگین', () => {
  it('مهمان چت نمی‌بیند', () => {
    expect(chatIneligibleReason({ ...eligible, isLogin: false })).toBe('not_logged_in');
  });

  it('تا وقتی وضعیتِ auth pending است چیزی نشان داده نمی‌شود (نشتی به مهمان)', () => {
    // store با pending:true شروع می‌شود؛ اگر این گیت نبود، یک لحظه به همه نشان داده می‌شد.
    expect(chatIneligibleReason({ ...eligible, isAuthPending: true, isLogin: false })).toBe('auth_pending');
  });

  it('kill-switch مقدم بر همه‌چیز است', () => {
    expect(chatIneligibleReason({ ...eligible, featureEnabled: false })).toBe('feature_off');
  });
});

describe('DR-11 §۱۱.۱ — پیش‌فیلترِ شکلی (نه خودِ trigger؛ حکم با سرور است)', () => {
  const CATALOG = [
    'فوق تخصص بیماری‌های غدد درون‌ریز و متابولیسم (اندوکرینولوژی)',
    'بیمارستان بهمن زنجان دکتر شیخ امین لواسانی',
    'دکتر سید محمدحافظ نوروزی زاده متخصص قلب و عروق تهران',
  ];
  it.each(CATALOG)('کوئریِ کاتالوگی «%s» چت را باز نمی‌کند', text => {
    expect(looksConversational(text)).toBe(false);
  });

  const CONVERSATIONAL = [
    'چند روزه که وقتی سرم را می‌چرخانم گردن و شانه‌ام درد می‌گیرد، به چه دکتری مراجعه کنم؟',
    'دنبال پزشکی هستم که بیمه نیروهای مسلح را قبول کند و در غرب تهران باشد',
    'نوبتی که گرفتم را چطور می‌توانم لغو کنم',
  ];
  it.each(CONVERSATIONAL)('جمله‌ی «%s» کاندیدِ چت است', text => {
    expect(looksConversational(text)).toBe(true);
  });

  // 🪤 رگرسیونِ اندازه‌گیری‌شده: نسخه‌ی اولِ خانواده‌ی ۴ فقط `لغو|کنسل` بود و «کنسل»
  // داخلِ «کنسلیِ» نامِ یک خدمت match می‌شد ⇒ ۳۷ از ۴۰ triggerِ ۲۴ ساعت غلط بود
  // (ghane exports/dr11-trigger-precision-20260729.md).
  const FALSE_POSITIVES = ['لیزر موهای زایدکل بدن کنسلیفقط مختص خانم ها', 'کنسل کاری و لیزر پوست و مو در تهران'];
  it.each(FALSE_POSITIVES)('متنِ کاتالوگیِ «%s» نباید کاندید شود', text => {
    expect(looksConversational(text)).toBe(false);
  });

  it('کوتاه/کم‌کلمه هرگز کاندید نیست', () => {
    expect(looksConversational('چرا؟')).toBe(false);
    expect(looksConversational('')).toBe(false);
  });
});
