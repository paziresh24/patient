import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  id: string;
  user_id?: string;
}

const dislikeReview = ({ id, user_id }: Params) => {
  return apiGatewayClient.delete(`/v1/feedbacks/${id}/like`, {
    headers: {
      'x-user-id': user_id,
    },
  });
};

export const useDislikeReview = () => {
  return useMutation(dislikeReview);
};
