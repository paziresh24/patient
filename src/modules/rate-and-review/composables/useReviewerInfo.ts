import { useQuery } from '@tanstack/react-query';
import { fetchReviewerInfo } from '../api';

export const useReviewerInfo = (userId?: string) =>
  useQuery(
    ['ravi', 'reviewerInfo', userId ?? ''],
    () => fetchReviewerInfo(userId!),
    { enabled: Boolean(userId), staleTime: 30 * 60 * 1000, retry: 0 },
  );
