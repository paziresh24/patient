import { apiGatewayClient } from '@/common/apis/client';

interface UsersParams {
  user_id: string;
}

export const users = async ({ user_id }: UsersParams) => {
  return await apiGatewayClient.get(`/v1/users/${user_id}`);
};
