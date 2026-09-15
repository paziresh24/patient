import { render } from '@testing-library/react';
import * as React from 'react';
import Paziresh24Avatar from './Paziresh24Avatar';

// regression گارد برای فیکسِ LCP (DR-08، docs/dev-requests/dr-08-listing-pagespeed.md): این wrapper
// («owned» توسط ما — .plasmic/plasmic/** با هر plasmic-sync رونویسی می‌شود، این فایل نه) تنها نقطه‌ای
// است که می‌توان props.img مصرف‌کننده (مثلاً loading="eager"/fetchPriority="high" برای اولین کارتِ
// لیست) را تا PlasmicImg زیرین پاس داد. قبل از این فیکس، `img={{ onError: handleImageError }}` بعد
// از `{...props}` می‌آمد و کل props.img کالر را (از جمله loading/fetchPriority) بی‌صدا حذف می‌کرد.
jest.mock('./plasmic/paziresh_24_design_system/PlasmicPaziresh24Avatar', () => ({
  __esModule: true,
  PlasmicPaziresh24Avatar: (props: any) => <div data-testid="img-props">{JSON.stringify(props.img)}</div>,
}));

describe('Paziresh24Avatar — img override نباید حذف شود (CLS/LCP regression گارد)', () => {
  it('props.img کالر (مثلاً loading=eager برای اولین کارت) با onError داخلی merge می‌شود، نه حذف', () => {
    const { getByTestId } = render(<Paziresh24Avatar src="https://cdn.example.com/a.jpg" img={{ loading: 'eager', fetchPriority: 'high' } as any} />);
    const received = JSON.parse(getByTestId('img-props').textContent ?? '{}');
    expect(received.loading).toBe('eager');
    expect(received.fetchPriority).toBe('high');
  });

  it('وقتی کالر img نمی‌دهد، فقط onError داخلیِ fallback باقی می‌ماند (رفتارِ قبلی حفظ می‌شود)', () => {
    const { getByTestId } = render(<Paziresh24Avatar src="https://cdn.example.com/a.jpg" />);
    const received = JSON.parse(getByTestId('img-props').textContent ?? '{}');
    expect(Object.keys(received)).toEqual([]);
    // onError خودش تابع است و در JSON.stringify حذف می‌شود؛ حضورش را جدا چک می‌کنیم.
  });
});
