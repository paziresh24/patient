/**
 * The two promises that are pure functions: «متن‌تان گم نمی‌شود» and «یک فیلدِ
 * جدیدِ بک‌اند نباید صفحه را بشکند».
 */
import { fallbackSearchUrl, readSuggestions, withTimeout } from './yaraTurn';
import type { TurnResponse } from '../chatApi';

const res = (over: Partial<TurnResponse> = {}) => ({ mode: 'chat', ...over }) as TurnResponse;

describe('fallbackSearchUrl — the patient’s own words are the escape hatch', () => {
  it('کلِ جمله را encode می‌کند، نه فقط بخشی از آن', () => {
    expect(fallbackSearchUrl('درد قفسه سینه دارم')).toBe('/s/?text=%D8%AF%D8%B1%D8%AF%20%D9%82%D9%81%D8%B3%D9%87%20%D8%B3%DB%8C%D9%86%D9%87%20%D8%AF%D8%A7%D8%B1%D9%85');
  });

  it('کاراکترهای خطرناکِ URL را نشت نمی‌دهد', () => {
    // verify-the-verifier: حذفِ encodeURIComponent این را قرمز می‌کند
    expect(fallbackSearchUrl('a&b=c #d')).toBe('/s/?text=a%26b%3Dc%20%23d');
  });
});

describe('readSuggestions — هر شکلِ نامنتظره یعنی «چیزی نشان نده»، نه crash', () => {
  it('آرایه‌ی درست را می‌خواند', () => {
    expect(readSuggestions(res({ suggestions: [{ key: 'k1', label: 'نوبت آنلاین' }] }))).toEqual([
      { key: 'k1', label: 'نوبت آنلاین' },
    ]);
  });

  it('نبودِ فیلد ⇒ آرایه‌ی خالی', () => {
    expect(readSuggestions(res())).toEqual([]);
    expect(readSuggestions(undefined)).toEqual([]);
  });

  it('شکلِ اشتباه (رشته / null / آیتمِ بدونِ label) هیچ چیزی تولید نمی‌کند', () => {
    expect(readSuggestions({ ...res(), suggestions: 'nope' } as unknown as TurnResponse)).toEqual([]);
    expect(readSuggestions({ ...res(), suggestions: null } as unknown as TurnResponse)).toEqual([]);
    expect(readSuggestions({ ...res(), suggestions: [{ key: 'k' }, { label: '   ' }] } as unknown as TurnResponse)).toEqual([]);
  });

  it('وقتی key نیست، خودِ label کلید می‌شود (تا رندر بدونِ key نماند)', () => {
    expect(readSuggestions({ ...res(), suggestions: [{ label: 'ادامه' }] } as unknown as TurnResponse)).toEqual([
      { key: 'ادامه', label: 'ادامه' },
    ]);
  });
});

describe('withTimeout — «در حال بررسی…» سقف دارد', () => {
  it('پاسخِ سریع را دست‌نخورده برمی‌گرداند', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 50)).resolves.toBe('ok');
  });

  it('درخواستِ معلق بعد از سقف null می‌شود (نه اسپینرِ بی‌پایان)', async () => {
    await expect(withTimeout(new Promise(() => undefined), 10)).resolves.toBeNull();
  });
});

describe('welcomeText — شخصی‌سازیِ فقط-کلاینت (§۱۳.۸)', () => {
  const { welcomeText, WELCOME_TEXT } = require('./yaraTurn');

  it('نامِ کوچک ⇒ خوش‌آمدِ شخصی', () => {
    expect(welcomeText('علی')).toContain('سلام علی عزیز');
  });

  it('نامِ چندبخشی ⇒ فقط بخشِ اول', () => {
    expect(welcomeText('سید محمدحافظ نوروزی')).toContain('سلام سید عزیز');
  });

  it('خالی/null/خیلی بلند ⇒ متنِ عمومی', () => {
    expect(welcomeText('')).toBe(WELCOME_TEXT);
    expect(welcomeText(null)).toBe(WELCOME_TEXT);
    expect(welcomeText('x'.repeat(40))).toBe(WELCOME_TEXT);
  });
});
