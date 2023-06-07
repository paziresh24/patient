import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import queryStirng from 'querystring';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  slug: string;
}

export const slugProfile = async ({ slug }: Params) => {
  const { data } = await clinicClient.post(
    `/api/slugProfile`,
    queryStirng.stringify({
      slug: slug,
    }),
  );
  return data;
};

export const useSlugProfile = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.SlugProfile, params], () => slugProfile(params), options);
};
