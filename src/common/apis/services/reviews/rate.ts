import { raviApiClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface Rate {
  slug: string;
}

export const rate = async (params: Rate) => {
  const { data } = await raviApiClient.get(`/ravi/v1/rate`, {
    params: {
      where: `(doctor_slug,eq,${params.slug})`,
    },
    timeout: 12_000,
  });
  return data;
};

export const useRate = (params: Rate, options?: any) => {
  return useQuery([ServerStateKeysEnum.Rate, params], () => rate(params), options);
};
