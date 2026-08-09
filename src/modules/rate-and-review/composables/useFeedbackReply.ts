import { useQuery } from '@tanstack/react-query';
import { fetchFeedbackReply } from '../api';

export const FEEDBACK_REPLY_KEY = (doctorSlug?: string, feedbackId?: string) =>
  ['ravi', 'feedbackReply', doctorSlug ?? '', feedbackId ?? ''] as const;

export const useFeedbackReply = (doctorSlug?: string, feedbackId?: string) =>
  useQuery(
    FEEDBACK_REPLY_KEY(doctorSlug, feedbackId),
    () => fetchFeedbackReply(doctorSlug!, feedbackId!),
    { enabled: Boolean(doctorSlug && feedbackId), staleTime: 60_000, retry: 0 },
  );
