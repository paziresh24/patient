import { useMutation } from '@tanstack/react-query';
import { clinicClient } from '../../client';

export const getBookmarksList = () => {
  return clinicClient.post('/api/mybookmarks');
};
export const useGetBookMarksList = () => {
  return useMutation(getBookmarksList);
};
