import { removeHtmlTagInString } from './removeHtmlTagInString';

describe('removeHtmlTagInString', () => {
  it('strips raw HTML tags', () => {
    expect(removeHtmlTagInString('<h2>رتبه برتر</h2>')).toBe('رتبه برتر');
  });

  it('decodes entity-encoded HTML then strips tags (center description from drprofile)', () => {
    const encoded =
      '&lt;h2&gt;&lt;span style=&quot;font-size:24px&quot;&gt;رتبه ی برتر بورد تخصصی قلب و عروق کشور&lt;/span&gt;&lt;br /&gt;\n&amp;nbsp;&lt;/h2&gt;';
    expect(removeHtmlTagInString(encoded).trim()).toBe('رتبه ی برتر بورد تخصصی قلب و عروق کشور');
  });

  it('does not leave executable markup for XSS', () => {
    const payload = '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;safe';
    expect(removeHtmlTagInString(payload)).toBe('safe');
    expect(removeHtmlTagInString(payload)).not.toMatch(/<|>|onerror/i);
  });

  it('handles empty input', () => {
    expect(removeHtmlTagInString()).toBe('');
    expect(removeHtmlTagInString('')).toBe('');
  });
});
