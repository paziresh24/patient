import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  id: string;
  user_id?: string;
}

const likeReview = ({ id, user_id }: Params) => {
  return apiGatewayClient.post(
    `/v1/feedbacks/${id}/like`,
    {},
    {
      headers: {
        'x-user-id': user_id,
      },
    },
  );
};

export const useLikeReview = () => {
  return useMutation(likeReview);
};
