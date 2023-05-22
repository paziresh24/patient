import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { clinicClient } from '../../client';

interface Params {
  slug: string;
}

export const deleteBookmark = (params: Params) => {
  return clinicClient.post(
    '/api/deleteBookmark',
    formData({
      certificate: getCookie('certificate'),
      ...params,
    }),
  );
};
export const useDeleteBookmark = () => {
  return useMutation(deleteBookmark);
};
