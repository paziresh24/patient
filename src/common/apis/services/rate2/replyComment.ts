import { apiGatewayClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
  description: string | any;
  user_id?: string;
}

export const replyComment = ({ feedback_id, description, user_id }: Params) => {
  return apiGatewayClient.post(
    `/v1/feedbacks/${feedback_id}`,
    formData({
      description,
    }),
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
