import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  id: string;
  description: string | any;
  user_id?: string;
}

export const replyComment = ({ id, description, user_id }: Params) => {
  return apiGatewayClient.post(
    `/v1/feedbacks/${id}`,
    {
      description,
    },
    {
      headers: {
        'x-user-id': user_id,
      },
    },
  );
};

export const useReplyComment = () => {
  return useMutation(replyComment);
};
