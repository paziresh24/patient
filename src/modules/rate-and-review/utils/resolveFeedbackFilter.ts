import { RaviFeedbackFilter, RaviReviewFilterValue, RaviSort } from '../types';

export const resolveFeedbackApiFilter = (
  sort: RaviSort,
  filter: RaviReviewFilterValue,
): RaviFeedbackFilter => {
  // feedbacks API: negative = reviews with avg rating between 3.5 and 4
  if (filter.type === 'not_recommended') return 'negative';
  if (sort === 'created_at') return 'newest';
  return 'default';
};
