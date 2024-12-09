import { apiGatewayClient, paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useCustomize from '@/common/hooks/useCustomize';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  slug: string;
  center_id?: string;
}

export const getServices = async ({ slug, ...params }: Params) => {
  const { data } = await apiGatewayClient.get(`/v1/doctors/${slug}/services`, { params, timeout: 2000 });
  return data;
};

export const useGetServices = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.Services, params], () => getServices({ ...params }), options);
};
