import { raviApiClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Rate {
  slug: string;
}

export const rate = async (params: Rate) => {
  // In the browser, call same-origin API to avoid CORS when RAVI host does not allow local/staging origins.
  if (typeof window !== 'undefined') {
    const { data } = await axios.get(`/api/ravi-rate`, {
      params: { slug: params.slug },
      timeout: 15_000,
    });
    return data;
  }

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
