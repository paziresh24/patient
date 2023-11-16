import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';

interface Params {
  user_id: string;
}

export const removeSubuser = async (params: Params) => {
  return await clinicClient.post(
    `/api/deleteSubUser`,
    formData({
      ...params,
    }),
  );
};

export const useRemoveSubuser = () => {
  return useMutation(removeSubuser);
};
