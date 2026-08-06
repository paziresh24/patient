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

/* ============== restore: structured payload first, stripped transcript as legacy ============== */

// اسکرین‌شاتِ روزِ لانچ (2026-08-06): بازیابیِ گفتگو transcriptِ خامِ audit را در یک
// حباب ریخت — لیستِ شماره‌دار، مسیرهای /dr/ و «[گامِ بعد: …]». این دو helper همان باگ‌اند.

import { archivedTurnResponse, stripTranscriptArtifacts } from './yaraTurn';

describe('archivedTurnResponse', () => {
  it('rebuilds a renderable turn from a stored payload, through the same shape live turns use', () => {
    const res = archivedTurnResponse({
      message: 'تخصصِ مرتبط «ارتوپدی» است.',
      results: [{ id: 'doctor_1', title: 'دکتر الف', expertise: 'ارتوپدی', url: '/dr/a/', type: 'doctor', position: 1 }],
      suggestions: [{ key: 'change_city', label: 'تغییر شهر' }],
    });
    expect(res?.mode).toBe('chat');
    expect(res?.message).toContain('ارتوپدی');
    expect(res?.results).toHaveLength(1);
  });

  it('refuses empty or malformed payloads — an empty bubble is worse than the text fallback', () => {
    expect(archivedTurnResponse(undefined)).toBeNull();
    expect(archivedTurnResponse(null)).toBeNull();
    expect(archivedTurnResponse('metn')).toBeNull();
    expect(archivedTurnResponse([])).toBeNull();
    expect(archivedTurnResponse({})).toBeNull();
    expect(archivedTurnResponse({ search_query: 'x', result_count: 0 })).toBeNull();
  });

  it('never re-arms a client_action from the archive — a restored chat must not reopen a cancel flow', () => {
    const res = archivedTurnResponse({
      message: 'x',
      client_action: { kind: 'cancel_booking', requires_confirmation: true },
    } as never);
    expect(res?.client_action).toBeUndefined();
  });
});

describe('stripTranscriptArtifacts', () => {
  it('drops audit markers and trailing path parens, keeps the human sentences', () => {
    const transcript = [
      'بر اساس چیزی که نوشتید، تخصصِ مرتبط «مغز و اعصاب» است.',
      '1. دکتر الف — مغز و اعصاب (/dr/دکتر-الف/)',
      '[گامِ بعد: تغییر شهر | فقط ویزیت آنلاین]',
      'این پاسخ راهنمای انتخابِ تخصص است.',
    ].join('\n');
    const out = stripTranscriptArtifacts(transcript);
    expect(out).toContain('مغز و اعصاب');
    expect(out).toContain('دکتر الف');
    expect(out).not.toContain('/dr/');
    expect(out).not.toContain('گامِ بعد');
  });

  it('is the identity on ordinary prose', () => {
    expect(stripTranscriptArtifacts('سلام، حالم خوب نیست؟')).toBe('سلام، حالم خوب نیست؟');
  });
});
