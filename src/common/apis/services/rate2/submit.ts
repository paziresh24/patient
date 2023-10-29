import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  external_id: string;
  description?: string;
  user_id?: string;
}

export const submitComment = async ({ external_id, description, user_id }: Params) => {
  return apiGatewayClient.post(
    `/v1/feedbacks`,
    {
      description,
      external_id,
    },
    {
      headers: {
        'x-user-id': user_id,
      },
    },
  );
};

export const useSubmitComment = () => {
  return useMutation(submitComment);
};
