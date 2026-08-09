import { RaviReview } from '../types';

const normalize = (value: string) => value.trim().toLowerCase();

export const filterReviewsBySearch = (reviews: RaviReview[], query: string): RaviReview[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return reviews;

  return reviews.filter(review => {
    const fields = [review.description, review.userName ?? '', review.centerName ?? ''];
    return fields.some(field => normalize(field).includes(normalizedQuery));
  });
};
