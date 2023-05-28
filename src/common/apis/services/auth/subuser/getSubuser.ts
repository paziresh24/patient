import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';

export const getSubuser = async () => {
  return await clinicClient.post(
    `/api/listSubUser`,
    formData({
      certificate: getCookie('certificate'),
    }),
  );
};

export const useGetSubuser = () => {
  return useMutation(getSubuser);
};
