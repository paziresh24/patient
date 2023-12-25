import { raviClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  raw: string;
  topic_id: string;
  nested_post?: boolean;
  draft_key?: string;
  reply_to_post_number?: string;
}

export const addReview = async ({ raw, topic_id, nested_post, draft_key, reply_to_post_number }: Params) => {
  return raviClient.post(`/posts`, {
    raw,
    topic_id,
    nested_post,
    draft_key,
    reply_to_post_number,
  });
};

export const useAddReview = () => {
  return useMutation(addReview);
};
