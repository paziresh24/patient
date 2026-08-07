/**
 * The snapshot is health data sitting in the browser. Each of these tests is a
 * boundary on how long it lives and whose conversation it may show.
 */
import { readSnapshot, snapshotMatches, writeSnapshot, clearSnapshot, SNAPSHOT_TTL_MS } from './yaraSession';
import type { YaraTurn } from './yaraTurn';

const turns: YaraTurn[] = [{ user: 'گردنم درد می‌کند' }];

beforeEach(() => window.sessionStorage.clear());

it('یک thread ذخیره و همان بازیابی می‌شود', () => {
  writeSnapshot({ conversationId: 'c-1', turns, scrollTop: 120 }, 1000);
  const back = readSnapshot(1000);
  expect(back?.conversationId).toBe('c-1');
  expect(back?.turns).toHaveLength(1);
  expect(back?.scrollTop).toBe(120);
});

it('بعد از TTL دیگر بازیابی نمی‌شود — گفتگوی دیروز نباید امروز روی صفحه بیاید', () => {
  writeSnapshot({ conversationId: 'c-1', turns, scrollTop: 0 }, 1000);
  expect(readSnapshot(1000 + SNAPSHOT_TTL_MS + 1)).toBeNull();
});

it('threadِ خالی چیزی ذخیره نمی‌کند (و قبلی را پاک می‌کند)', () => {
  writeSnapshot({ conversationId: 'c-1', turns, scrollTop: 0 }, 1000);
  writeSnapshot({ conversationId: '', turns: [], scrollTop: 0 }, 1000);
  expect(readSnapshot(1000)).toBeNull();
});

it('محتوای خراب ⇒ «از نو شروع کن»، نه throw روی mount', () => {
  window.sessionStorage.setItem('yara:thread', '{not json');
  expect(readSnapshot()).toBeNull();
});

it('snapshotِ یک گفتگوی دیگر برای URLِ مشخص بازیابی نمی‌شود', () => {
  const snap = { conversationId: 'c-1', turns, scrollTop: 0, savedAt: 1 };
  expect(snapshotMatches(snap, 'c-2')).toBe(false);
  expect(snapshotMatches(snap, 'c-1')).toBe(true);
  // URLِ بدونِ ?c= یعنی «همان گفتگویی که داشتم» — مسیرِ بازگشت از پروفایلِ پزشک
  expect(snapshotMatches(snap, '')).toBe(true);
  expect(snapshotMatches(null, '')).toBe(false);
});

it('clearSnapshot واقعاً پاک می‌کند — «گفت‌وگوی جدید» نباید قبلی را برگرداند', () => {
  writeSnapshot({ conversationId: 'c-1', turns, scrollTop: 0 }, 1000);
  clearSnapshot();
  expect(readSnapshot(1000)).toBeNull();
});
