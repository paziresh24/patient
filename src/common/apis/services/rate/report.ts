import { feedbacksClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
}

export const reportFeedback = ({ feedback_id }: Params) => {
  return feedbacksClient.post(`/v1/feedbacks/report`, {
    feedback_id: feedback_id,
  });
};

export const useReportFeedback = () => {
  return useMutation(reportFeedback);
};
