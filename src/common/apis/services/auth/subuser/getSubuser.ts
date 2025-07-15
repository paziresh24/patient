import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

export const getSubuser = async () => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('subuser:api-endpoints', {});
  return await clinicClient.post(endpoints?.list ?? `/api/listSubUser`);
};

export const useGetSubuser = () => {
  return useMutation(getSubuser);
};
