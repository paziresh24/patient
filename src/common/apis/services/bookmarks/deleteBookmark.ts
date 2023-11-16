import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { clinicClient } from '../../client';

interface Params {
  slug: string;
}

export const deleteBookmark = (params: Params) => {
  return clinicClient.post(
    '/api/deleteBookmark',
    formData({
      ...params,
    }),
  );
};
export const useDeleteBookmark = () => {
  return useMutation(deleteBookmark);
};
