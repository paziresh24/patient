import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import formData from '@/common/utils/formData';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  slug: string;
}

export const isBookmark = (params: Params) => {
  return clinicClient.post(
    `/api/isBookmark`,
    formData({
      ...params,
    }),
  );
};

export const useIsBookmark = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.IsBookmark, params], () => isBookmark(params), options);
};
