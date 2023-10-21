import { feedbacksClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
}

export const removeFeedback = ({ feedback_id }: Params) => {
  return feedbacksClient.delete(`/v1/feedbacks/${feedback_id}`);
};

export const useRemoveFeedback = () => {
  return useMutation(removeFeedback);
};
