import { resolveFeedbackApiFilter } from './resolveFeedbackFilter';

describe('resolveFeedbackApiFilter', () => {
  it('maps negative filter to negative API filter', () => {
    expect(resolveFeedbackApiFilter('default_order', { type: 'not_recommended' })).toBe('negative');
    expect(resolveFeedbackApiFilter('created_at', { type: 'not_recommended' })).toBe('negative');
  });

  it('maps newest sort to newest API filter when not negative', () => {
    expect(resolveFeedbackApiFilter('created_at', { type: 'all' })).toBe('newest');
    expect(resolveFeedbackApiFilter('created_at', { type: 'center_id', value: 'c1' })).toBe('newest');
  });

  it('defaults to default API filter', () => {
    expect(resolveFeedbackApiFilter('default_order', { type: 'all' })).toBe('default');
    expect(resolveFeedbackApiFilter('default_order', { type: 'center_id', value: 'c1' })).toBe('default');
  });
});
