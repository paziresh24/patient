import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';

export const getUser = async () => {
  return await clinicClient.post(
    `/api/getUser`,
    formData({
      certificate: getCookie('certificate'),
    }),
  );
};

export const useGetUser = () => {
  return useMutation(getUser);
};
