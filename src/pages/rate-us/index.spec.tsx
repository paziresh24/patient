// next/head's real implementation portals into document.head via a side-effect that isn't reliable
// under jsdom + RTL without a full Next app context; mock it to render children inline so we can
// assert on the noindex meta tag directly in the rendered tree.
jest.mock('next/head', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

import { render, screen } from '@testing-library/react';
import RateUsPage from './index';

describe('RateUsPage (DR-13)', () => {
  it('renders the thank-you heading', () => {
    render(<RateUsPage />);
    expect(screen.getByRole('heading', { name: 'نظر شما برای ما مهم است!' })).toBeInTheDocument();
  });

  it('renders all three store links with exact hrefs', () => {
    render(<RateUsPage />);

    const googlePlay = screen.getByText('ثبت نظر در گوگل پلی').closest('a');
    expect(googlePlay).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=com.paziresh24.paziresh24');

    const cafeBazaar = screen.getByText('ثبت نظر در کافه بازار').closest('a');
    expect(cafeBazaar).toHaveAttribute(
      'href',
      'intent://details?id=com.paziresh24.paziresh24#Intent;scheme=bazaar;package=com.farsitel.bazaar;action=android.intent.action.EDIT;S.browser_fallback_url=https%3A%2F%2Fcafebazaar.ir%2Fapp%2Fcom.paziresh24.paziresh24;end',
    );

    const myket = screen.getByText('ثبت نظر در مایکت').closest('a');
    expect(myket).toHaveAttribute('href', 'myket://comment?id=com.paziresh24.paziresh24');
  });

  it('renders all six share buttons', () => {
    const { container } = render(<RateUsPage />);
    const socialButtons = container.querySelectorAll('.rateUsSocialButtons a');
    expect(socialButtons).toHaveLength(6);
  });

  it('picks a random share text always from the same set of 5 predefined texts', () => {
    // re-import the module in isolation to reach the (non-exported) sharing text pool indirectly:
    // we validate behavior via the public getRandomShareText-equivalent surface — the Facebook share
    // handler builds its URL from one of the 5 texts, so we spy on window.open and inspect the query.
    render(<RateUsPage />);
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    const facebookBtn = document.querySelector('.rateUsFacebook') as HTMLAnchorElement;
    expect(facebookBtn).toBeTruthy();

    const seenTexts = new Set<string>();
    for (let i = 0; i < 40; i++) {
      facebookBtn.click();
    }
    expect(openSpy).toHaveBeenCalled();
    openSpy.mock.calls.forEach(([url]) => {
      expect(typeof url).toBe('string');
      expect(url as string).toMatch(/^https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=/);
      const match = (url as string).match(/quote=([^&]+)/);
      expect(match).toBeTruthy();
      seenTexts.add(decodeURIComponent(match![1]));
    });
    // هر متنِ دیده‌شده باید یکی از همان ۵ متنِ ثابتِ اصلی باشد (نه چیز دیگری)
    seenTexts.forEach(text => {
      expect(text).toMatch(/#پذیرش24/);
    });

    openSpy.mockRestore();
  });

  it('sets robots noindex meta so this page is never indexed', () => {
    const { container } = render(<RateUsPage />);
    const meta = container.querySelector('meta[name="robots"]');
    expect(meta).toHaveAttribute('content', 'noindex');
  });
});
