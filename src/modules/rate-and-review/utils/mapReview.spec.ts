import { mapRawReviewToRaviReview } from './mapReview';

describe('mapRawReviewToRaviReview', () => {
  it('normalizes common API field variants', () => {
    const review = mapRawReviewToRaviReview({
      id: 42,
      user_display_name: '  سارا  ',
      description: 'عالی بود',
      relativeCreatedTime: '۲ روز پیش',
      center_name: 'مرکز شمال',
      visit_status: 'visited',
      avg_rate_value: '4.2',
      count_like: '3',
      user_id: 1001,
    });

    expect(review).toEqual({
      id: '42',
      userId: '1001',
      userName: 'سارا',
      description: 'عالی بود',
      dateLabel: '۲ روز پیش',
      centerName: 'مرکز شمال',
      visited: true,
      rate: 4.2,
      likeCount: 3,
    });
  });

  it('keeps only first name from full user_display_name', () => {
    const review = mapRawReviewToRaviReview({
      id: 7,
      user_display_name: 'نرگس بهرامی',
      description: 'خوب',
      user_id: 9,
    });

    expect(review.userName).toBe('نرگس');
  });

  it('handles missing optional fields', () => {
    const review = mapRawReviewToRaviReview({ Id: 'x', description: null });

    expect(review.id).toBe('x');
    expect(review.description).toBe('');
    expect(review.userName).toBeUndefined();
    expect(review.rate).toBeNull();
    expect(review.visited).toBe(false);
    expect(review.dateLabel).toBe('—');
  });
});
