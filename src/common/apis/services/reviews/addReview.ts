import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  raw: string;
  topic_id: string;
  nested_post?: boolean;
  draft_key?: string;
  user_id?: string;
  reply_to_post_number?: string;
}

export const addReview = async ({ raw, topic_id, nested_post, draft_key, user_id, reply_to_post_number }: Params) => {
  return apiGatewayClient.post(
    `/ravi/posts`,
    {
      raw,
      topic_id,
      nested_post,
      draft_key,
      reply_to_post_number,
    },
    {
      headers: {
        'Api-Key': '060c32e3d34c15b4648baebeed75f43cd86d72f71b598ab2d07da71dba9328c8',
        'Api-Username': user_id,
      },
    },
  );
};

export const useAddReview = () => {
  return useMutation(addReview);
};
