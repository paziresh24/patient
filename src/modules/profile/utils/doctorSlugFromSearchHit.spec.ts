import { doctorSlugFromSearchHit } from './doctorSlugFromSearchHit';

describe('doctorSlugFromSearchHit', () => {
  it('reads slug from a search url', () => {
    expect(doctorSlugFromSearchHit({ url: '/dr/سارا-اقبالی' })).toBe('سارا-اقبالی');
  });

  it('prefers an explicit slug field', () => {
    expect(doctorSlugFromSearchHit({ slug: 'سارا-اقبالی', url: '/dr/other' })).toBe('سارا-اقبالی');
  });
});
