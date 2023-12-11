import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  raw: string;
  topic_id: string;
  nested_post?: boolean;
}

export const addReview = async ({ raw, topic_id, nested_post }: Params) => {
  return apiGatewayClient.post(`/ravi/posts`, {
    raw,
    topic_id,
    nested_post,
  });
};

export const useAddReview = () => {
  return useMutation(addReview);
};
