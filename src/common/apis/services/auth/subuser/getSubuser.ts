import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

export const getSubuser = async () => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});
  return await clinicClient.post(endpoints?.list_sub_user ?? `/api/listSubUser`);
};

export const useGetSubuser = () => {
  return useMutation(getSubuser);
};
