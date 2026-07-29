import { detectBot } from '@/common/utils/detectBot';

describe('detectBot', () => {
  it('returns false for empty UA', () => {
    expect(detectBot(null)).toBe(false);
    expect(detectBot('')).toBe(false);
  });

  it('detects common crawlers', () => {
    expect(detectBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
    expect(detectBot('bingbot/2.0')).toBe(true);
  });

  it('returns false for normal browsers', () => {
    expect(
      detectBot(
        'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      ),
    ).toBe(false);
  });
});
