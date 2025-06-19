import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const getUser = async () => {
  return await clinicClient.post(`/api/getUser`);
};

export const useGetUser = () => {
  return useMutation(getUser);
};
