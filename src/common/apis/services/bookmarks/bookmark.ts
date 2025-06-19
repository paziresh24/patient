import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  slug: string;
}

export const bookmark = (params: Params) => {
  return clinicClient.post(
    `/api/bookmark`,
    formData({
      ...params,
    }),
  );
};

export const useBookmark = () => {
  return useMutation(bookmark);
};
