import { buildRaviDocsideUrl, RAVI_DOCSIDE_PATH } from './buildRaviDocsideUrl';

describe('buildRaviDocsideUrl', () => {
  it('points at the live ravi-front doctor reviews page', () => {
    expect(buildRaviDocsideUrl()).toBe(`https://ravi-front-ravi.p24cloud.ir${RAVI_DOCSIDE_PATH}`);
  });

  it('passes the session token so p24cloud can identify the logged-in doctor', () => {
    expect(buildRaviDocsideUrl('abc.def')).toBe(
      `https://ravi-front-ravi.p24cloud.ir${RAVI_DOCSIDE_PATH}?token=abc.def`,
    );
  });
});
