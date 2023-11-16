import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const getSubuser = async () => {
  return await clinicClient.post(`/api/listSubUser`);
};

export const useGetSubuser = () => {
  return useMutation(getSubuser);
};
