import { getGrowthPathTeaser, normalizeGrowthPath } from './growthPath';

describe('getGrowthPathTeaser', () => {
  it('teases the active step and remaining count', () => {
    const path = normalizeGrowthPath({
      completed_count: 8,
      total_count: 16,
      steps: [
        { state: 'done', title: 'قبلی' },
        { state: 'active', title: 'تکمیل ساعات کاری' },
        { state: 'upcoming', title: 'بعدی' },
      ],
    });
    expect(path).not.toBeNull();
    expect(getGrowthPathTeaser(path!)).toEqual({
      remaining: 8,
      percent: 50,
      stepTitle: 'تکمیل ساعات کاری',
      complete: false,
    });
  });
});
