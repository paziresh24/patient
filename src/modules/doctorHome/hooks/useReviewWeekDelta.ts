import { useGetReview } from '@/common/apis/services/reviews/getReviews';
import { useMemo } from 'react';
import { doctorHomeListQueryDefaults } from '../utils/doctorHomeQuery';
import { buildReviewWeekDeltaPercent, extractFeedbackList, tehranTodayKey } from '../utils/reviewWeekDelta';

export const useReviewWeekDelta = (slug?: string, enabled = true) => {
  const today = tehranTodayKey();
  const reviews = useGetReview(
    {
      slug,
      sort: 'created_at',
      offset: 0,
      limit: 200,
    },
    {
      enabled: enabled && !!slug,
      ...doctorHomeListQueryDefaults,
    },
  );

  const percent = useMemo(
    () => buildReviewWeekDeltaPercent(extractFeedbackList(reviews.data), today),
    [reviews.data, today],
  );

  return { percent };
};
