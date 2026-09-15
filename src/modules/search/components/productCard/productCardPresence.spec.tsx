import ProductCard from '.plasmic/ProductCard';
import { __resetDoctorPresenceCache } from '@/modules/search/hooks/useDoctorPresence';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

/**
 * تستِ سرتاسری روی **خودِ کارتِ Plasmic** — نه یک mock. هدف این است که اگر مارکاپِ کارت با
 * `plasmic-sync` عوض شد و گرهِ `top_title` جای دیگری رفت، همین تست قرمز شود؛ چیزی که با اسکریپتِ
 * تزریقیِ قبلی ممکن نبود (کدش در repo نبود، پس هیچ CIای نمی‌توانست بشکند).
 */

const actionButtons = [
  {
    title: 'ویزیت آنلاین',
    top_title: 'پاسخ: کمتر از یک ساعت',
    url: 'https://www.paziresh24.com/dr/dr-ali-rezaei/',
  },
];

function mockFetch(payload: unknown) {
  const fn = jest.fn().mockResolvedValue({ ok: true, json: async () => payload });
  (global as unknown as { fetch: unknown }).fetch = fn;
  return fn;
}

beforeEach(() => {
  __resetDoctorPresenceCache();
  // jsdom `matchMedia` ندارد و ورینتِ صفحه‌نمایشِ Plasmic بدونِ آن می‌افتد.
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
      onchange: null,
    }),
  });
});

describe('ProductCard + حضورِ پزشک', () => {
  it('slug روی ریشه‌ی کارت به‌عنوانِ قراردادِ پایدار می‌نشیند', async () => {
    mockFetch([]);
    const { container } = render(<ProductCard slug="dr-ali-rezaei" title="دکتر علی رضایی" actionButtons={actionButtons} />);

    await waitFor(() => expect(container.querySelector('[data-doctor-slug="dr-ali-rezaei"]')).not.toBeNull());
  });

  it('متنِ «X پیش آنلاین بوده» جای «پاسخ: …» می‌نشیند', async () => {
    const fetchMock = mockFetch([{ slug: 'dr-ali-rezaei', online: false, last_seen: '۳۷ دقیقه پیش آنلاین بوده' }]);

    const { container } = render(<ProductCard slug="dr-ali-rezaei" title="دکتر علی رضایی" actionButtons={actionButtons} />);

    await waitFor(() => expect(container.textContent).toContain('۳۷ دقیقه پیش آنلاین بوده'));
    expect(container.textContent).not.toContain('پاسخ:');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('چند کارتِ همان لیست فقط یک درخواست می‌زنند', async () => {
    const fetchMock = mockFetch([
      { slug: 'a', last_seen: '۱ ساعت پیش آنلاین بوده' },
      { slug: 'b', last_seen: '۲ ساعت پیش آنلاین بوده' },
    ]);

    const { container } = render(
      <>
        <ProductCard slug="a" title="الف" actionButtons={actionButtons} />
        <ProductCard slug="b" title="ب" actionButtons={actionButtons} />
      </>,
    );

    await waitFor(() => expect(container.textContent).toContain('۲ ساعت پیش آنلاین بوده'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ slugs: ['a', 'b'] });
  });

  it('نبودنِ سرویس کارت را خراب نمی‌کند', async () => {
    (global as unknown as { fetch: unknown }).fetch = jest.fn().mockRejectedValue(new Error('offline'));

    const { container } = render(<ProductCard slug="dr-ali-rezaei" title="دکتر علی رضایی" actionButtons={actionButtons} />);

    await waitFor(() => expect(container.querySelector('[data-doctor-slug]')).not.toBeNull());
    expect(container.textContent).toContain('دکتر علی رضایی');
  });
});
