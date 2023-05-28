import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';

interface Params {
  user_id: string;
}

export const removeSubuser = async (params: Params) => {
  return await clinicClient.post(
    `/api/deleteSubUser`,
    formData({
      certificate: getCookie('certificate'),
      ...params,
    }),
  );
};

export const useRemoveSubuser = () => {
  return useMutation(removeSubuser);
};
