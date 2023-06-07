import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';

interface Params {
  name: string;
  family: string;
  national_code: string;
  gender: string;
  cell: string;
}

export const addSubuser = async (params: Params) => {
  return await clinicClient.post(
    `/api/addSubUser`,
    formData({
      certificate: getCookie('certificate'),
      ...params,
    }),
  );
};

export const useAddSubuser = () => {
  return useMutation(addSubuser);
};
