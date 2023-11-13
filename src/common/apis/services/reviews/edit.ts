import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  id: string;
  description?: string;
  user_id?: string;
}

export const editComment = ({ id, description, user_id }: Params) => {
  return apiGatewayClient.patch(
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

export const useEditComment = () => {
  return useMutation(editComment);
};
