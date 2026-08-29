import { __resetDoctorPresenceCache, normalizeSlug, useDoctorPresence } from './useDoctorPresence';
import { act, renderHook, waitFor } from '@testing-library/react';

const ENDPOINT = 'https://support-n8n.paziresh24.com/webhook/doctor-search-cards';

function mockFetch(payload: unknown, ok = true) {
  const fn = jest.fn().mockResolvedValue({ ok, json: async () => payload });
  (global as unknown as { fetch: unknown }).fetch = fn;
  return fn;
}

beforeEach(() => {
  __resetDoctorPresenceCache();
  jest.useRealTimers();
});

describe('normalizeSlug', () => {
  it('پیشوندِ /dr/ و اسلشِ آخر و encode را یکسان می‌کند', () => {
    expect(normalizeSlug('/dr/dr-ali/')).toBe('dr-ali');
    expect(normalizeSlug('dr-ali')).toBe('dr-ali');
    expect(normalizeSlug('/dr/%D8%AF%DA%A9%D8%AA%D8%B1/')).toBe('دکتر');
    expect(normalizeSlug('')).toBeNull();
    expect(normalizeSlug(undefined)).toBeNull();
  });
});

describe('useDoctorPresence', () => {
  it('چند کارت در یک پنجره فقط یک درخواست می‌زنند', async () => {
    const fetchMock = mockFetch([
      { slug: 'a', online: true, last_seen: '۱ دقیقه پیش آنلاین بوده' },
      { slug: 'b', online: false, last_seen: null },
    ]);

    const a = renderHook(() => useDoctorPresence('a'));
    const b = renderHook(() => useDoctorPresence('b'));
    const c = renderHook(() => useDoctorPresence('/dr/c/'));

    await waitFor(() => expect(a.result.current.resolved).toBe(true));
    await waitFor(() => expect(b.result.current.resolved).toBe(true));
    await waitFor(() => expect(c.result.current.resolved).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ slugs: ['a', 'b', 'c'] });
    expect(fetchMock.mock.calls[0][0]).toBe(ENDPOINT);

    expect(a.result.current.presence?.online).toBe(true);
    expect(b.result.current.presence?.last_seen).toBeNull();
    // slugی که سرور برنگردانده «حل‌شده ولی بدونِ سابقه» است، نه «هنوز نمی‌دانیم».
    expect(c.result.current.presence).toBeNull();
  });

  it('slugِ تکراری دوباره درخواست نمی‌زند (کشِ ماژول)', async () => {
    const fetchMock = mockFetch([{ slug: 'a', last_seen: 'دیروز آنلاین بوده' }]);

    const first = renderHook(() => useDoctorPresence('a'));
    await waitFor(() => expect(first.result.current.resolved).toBe(true));

    const second = renderHook(() => useDoctorPresence('/dr/a'));
    await waitFor(() => expect(second.result.current.resolved).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second.result.current.presence?.last_seen).toBe('دیروز آنلاین بوده');
  });

  it('خطای شبکه کارت را خراب نمی‌کند', async () => {
    (global as unknown as { fetch: unknown }).fetch = jest.fn().mockRejectedValue(new Error('offline'));

    const { result } = renderHook(() => useDoctorPresence('a'));

    await waitFor(() => expect(result.current.resolved).toBe(true));
    expect(result.current.presence).toBeNull();
  });

  it('پاسخِ غیر ۲۰۰ هم بی‌صدا رد می‌شود', async () => {
    mockFetch(null, false);
    const { result } = renderHook(() => useDoctorPresence('a'));
    await waitFor(() => expect(result.current.resolved).toBe(true));
    expect(result.current.presence).toBeNull();
  });

  it('بدونِ slug اصلاً درخواستی نمی‌رود', async () => {
    const fetchMock = mockFetch([]);
    const { result } = renderHook(() => useDoctorPresence(undefined));
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.resolved).toBe(false);
  });
});
