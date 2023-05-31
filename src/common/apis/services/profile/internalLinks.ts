import { contentClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  links: string[];
}

export const internalLinks = async (params: Params) => {
  const { data } = await contentClient.get(`/internal-links`, {
    params,
  });
  return data;
};

export const useInternalLinks = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.InternalLinks, params], () => internalLinks(params), options);
};
