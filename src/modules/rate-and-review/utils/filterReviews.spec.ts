import { RaviReview } from '../types';
import { filterReviewsBySearch } from './filterReviews';

const sampleReviews: RaviReview[] = [
  {
    id: '1',
    description: 'پزشک بسیار دلسوز بود',
    userName: 'علی',
    centerName: 'کلینیک تهران',
    dateLabel: 'دیروز',
    visited: true,
    rate: 4.5,
  },
  {
    id: '2',
    description: 'انتظار طولانی',
    userName: 'مریم',
    centerName: 'بیمارستان',
    dateLabel: 'هفته پیش',
    visited: false,
    rate: 3.8,
  },
];

describe('filterReviewsBySearch', () => {
  it('returns all reviews when query is empty', () => {
    expect(filterReviewsBySearch(sampleReviews, '')).toEqual(sampleReviews);
    expect(filterReviewsBySearch(sampleReviews, '   ')).toEqual(sampleReviews);
  });

  it('filters by description case-insensitively', () => {
    expect(filterReviewsBySearch(sampleReviews, 'دلسوز')).toHaveLength(1);
    expect(filterReviewsBySearch(sampleReviews, 'دلسوز')[0].id).toBe('1');
  });

  it('filters by user name and center name', () => {
    expect(filterReviewsBySearch(sampleReviews, 'مریم')).toHaveLength(1);
    expect(filterReviewsBySearch(sampleReviews, 'بیمارستان')).toHaveLength(1);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterReviewsBySearch(sampleReviews, 'xyz-not-found')).toEqual([]);
  });
});
