import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface LikeParams {
  id: string;
  post_action_type_id: number;
  flag_topic: boolean;
}

const likeReview = (params: LikeParams) => {
  return apiGatewayClient.post(`/ravi/post_actions`, { ...params });
};

export const useLikeReview = () => {
  return useMutation(likeReview);
};
