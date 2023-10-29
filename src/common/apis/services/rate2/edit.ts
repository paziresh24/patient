import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
  description?: string;
  user_id?: string;
}

export const editComment = ({ feedback_id, description, user_id }: Params) => {
  return apiGatewayClient.patch(
    `/v1/feedbacks/${feedback_id}`,
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

export const useEditComment = () => {
  return useMutation(editComment);
};
