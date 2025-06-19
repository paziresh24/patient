import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface UsersParams {
  user_id: string;
}

export const users = async ({ user_id }: UsersParams) => {
  return await apiGatewayClient.get(`/v1/users/${user_id}`, { timeout: 2000 });
};

export const useUsers = () => useMutation(users);
