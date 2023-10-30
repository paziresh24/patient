import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  id: string;
  user_id?: string;
}

export const deleteFeedback = ({ id, user_id }: Params) => {
  return apiGatewayClient.delete(`/v1/feedbacks/${id}`, {
    headers: {
      'x-user-id': user_id,
    },
  });
};

export const useDeleteFeedback = () => {
  return useMutation(deleteFeedback);
};
