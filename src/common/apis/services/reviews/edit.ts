import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  raw: string;
  id: string;
  user_id?: string;
}

export const editComment = ({ raw, id, user_id }: Params) => {
  return apiGatewayClient.put(
    `/v1/feedbacks/${id}`,
    {
      raw,
    },
    {
      headers: {
        'Api-Key': '060c32e3d34c15b4648baebeed75f43cd86d72f71b598ab2d07da71dba9328c8',
        'Api-Username': user_id,
      },
    },
  );
};

export const useEditComment = () => {
  return useMutation(editComment);
};
