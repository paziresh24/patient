import { getPageFromOneAppData, pageParametersMatch } from '@/modules/hamdast/utils/getPageFromOneAppData';

describe('pageParametersMatch', () => {
  it('matches equal parameter values', () => {
    expect(pageParametersMatch(['CHAT'], ['CHAT'])).toBe(true);
    expect(pageParametersMatch(['SERVICE'], ['CHAT'])).toBe(false);
    expect(pageParametersMatch([], [])).toBe(true);
    expect(pageParametersMatch(undefined, [])).toBe(true);
    expect(pageParametersMatch(['CHAT'], [])).toBe(false);
  });
});

describe('getPageFromOneAppData', () => {
  const appData = {
    fragments: [
      {
        type: 'pages',
        options: [
          {
            key: 'flows',
            parameters: ['SERVICE'],
            embed_src: 'https://example.com/service',
          },
          {
            key: 'flows',
            parameters: ['CHAT'],
            embed_src: 'https://example.com/chat',
          },
          {
            key: 'launcher',
            parameters: [],
            embed_src: 'https://example.com/launcher',
          },
        ],
      },
    ],
  };

  it('selects the flows page whose parameters equal CHAT, not the first flows page', () => {
    const page = getPageFromOneAppData(appData, 'flows', ['CHAT']);
    expect(page?.embed_src).toBe('https://example.com/chat');
    expect(page?.parameters).toEqual(['CHAT']);
  });

  it('selects SERVICE when that route param is requested', () => {
    const page = getPageFromOneAppData(appData, 'flows', ['SERVICE']);
    expect(page?.embed_src).toBe('https://example.com/service');
  });

  it('does not fall back to another flows page when params do not match', () => {
    expect(getPageFromOneAppData(appData, 'flows', ['ONLINE_VISIT_CHANNEL_BUTTON'])).toBeNull();
  });

  it('matches launcher with empty parameters', () => {
    expect(getPageFromOneAppData(appData, 'launcher', [])?.embed_src).toBe('https://example.com/launcher');
  });
});
