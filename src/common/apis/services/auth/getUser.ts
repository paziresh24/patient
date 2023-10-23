import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

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
