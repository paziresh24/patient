import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
  user_id?: string;
}

export const deleteFeedback = ({ feedback_id, user_id }: Params) => {
  return apiGatewayClient.delete(`/v1/feedbacks/${feedback_id}`, {
    headers: {
      'x-user-id': user_id,
    },
  });
};

export const useDeletFeedback = () => {
  return useMutation(deleteFeedback);
};
