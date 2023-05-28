import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';

interface Params {
  name: string;
  family: string;
  national_code: string;
  gender: string;
  cell: string;
  id: string;
}

export const editSubuser = async (params: Params) => {
  return await clinicClient.post(
    `/api/updateSubUser`,
    formData({
      certificate: getCookie('certificate'),
      ...params,
    }),
  );
};

export const useEditSubuser = () => {
  return useMutation(editSubuser);
};
