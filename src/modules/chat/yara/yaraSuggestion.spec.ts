/**
 * «تغییر شهر باید کار کند» — the owner's test, as a test.
 */
import { busyLabel, suggestionAction } from './yaraTurn';

it('چیپی که نامِ یک پارامترِ گمشده است، کادر را نیمه‌پر می‌کند — نه اینکه turn بفرستد', () => {
  const act = suggestionAction({ key: 'k', label: 'تغییر شهر' });
  expect(act.mode).toBe('prefill');
  // ⛔ باید ناتمام باشد: جمله‌ی کامل + فوکوس یعنی دعوت به Enter زدن روی کلماتی
  // که کاربر انتخابشان نکرده.
  expect(act.text).toBe('شهرم را عوض کن به ');
});

it('چیپِ معمولی همان‌طور که بود ارسال می‌شود', () => {
  expect(suggestionAction({ key: 'k', label: 'فقط نوبت امروز' })).toEqual({
    mode: 'send',
    text: 'فقط نوبت امروز',
  });
});

it('اگر khesht خودش prefill بفرستد، همان برنده است', () => {
  expect(suggestionAction({ key: 'k', label: 'هرچه', prefill: 'بیمه‌ی من ' })).toEqual({
    mode: 'prefill',
    text: 'بیمه‌ی من ',
  });
});

it('پیامِ انتظار با گذشتِ زمان عوض می‌شود و هیچ‌وقت خالی نیست', () => {
  expect(busyLabel(0)).toContain('پیام شما');
  expect(busyLabel(4000)).toContain('پزشکِ مناسب');
  expect(busyLabel(12000)).toContain('طول کشید');
  expect(busyLabel(0)).not.toBe(busyLabel(12000));
});
