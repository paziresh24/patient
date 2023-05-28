import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';
import { clinicClient } from '../../client';

export const getBookmarksList = () => {
  return clinicClient.post(
    '/api/mybookmarks',
    formData({
      certificate: getCookie('certificate'),
    }),
  );
};
export const useGetBookMarksList = () => {
  return useMutation(getBookmarksList);
};
