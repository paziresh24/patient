import { buildRaviDocsideHandoffSrc, RAVI_DOCSIDE_HANDOFF_PATH } from './buildRaviDocsideHandoff';

describe('ravi docside handoff', () => {
  it('keeps the iframe on the same origin so the httpOnly token cookie is sent', () => {
    expect(buildRaviDocsideHandoffSrc()).toBe(RAVI_DOCSIDE_HANDOFF_PATH);
    expect(buildRaviDocsideHandoffSrc().startsWith('http')).toBe(false);
  });
});
