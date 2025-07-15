import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

interface Params {
  user_id: string;
}

export const removeSubuser = async (params: Params) => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('subuser:api-endpoints', {});
  return await clinicClient.post(
    endpoints?.delete ?? `/api/deleteSubUser`,
    formData({
      ...params,
    }),
  );
};

export const useRemoveSubuser = () => {
  return useMutation(removeSubuser);
};
