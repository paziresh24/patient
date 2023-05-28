import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';

interface Params {
  name?: string;
  family?: string;
  national_code?: string;
  gender?: string;
  cell?: string;
  city?: string;
  province?: string;
  image?: any;
}

export const updateUser = async (params: Params) => {
  return await clinicClient.post(
    `/api/userUpdate`,
    formData({
      certificate: getCookie('certificate'),
      ...params,
    }),
  );
};

export const useUpdateUser = () => {
  return useMutation(updateUser);
};
