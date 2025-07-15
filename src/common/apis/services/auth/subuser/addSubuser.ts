import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

interface Params {
  name: string;
  family: string;
  national_code: string;
  gender: string;
  cell: string;
}

export const addSubuser = async (params: Params) => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('subuser:api-endpoints', {});
  return await clinicClient.post(
    endpoints?.add ?? `/api/addSubUser`,
    formData({
      ...params,
    }),
  );
};

export const useAddSubuser = () => {
  return useMutation(addSubuser);
};
