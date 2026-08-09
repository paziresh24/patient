import { useQuery } from '@tanstack/react-query';
import { fetchReviewerName } from '../api';

export const useReviewerName = (userId?: string) =>
  useQuery(
    ['ravi', 'reviewerName', userId ?? ''],
    () => fetchReviewerName(userId!),
    { enabled: Boolean(userId), staleTime: 30 * 60 * 1000, retry: 0 },
  );
