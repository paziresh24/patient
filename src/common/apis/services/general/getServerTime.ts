import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

export const getServerTime = () => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return paziresh24AppClient.get(endpoints?.time_v1 ?? '/V1/time');
};
export const useGetServerTime = () => {
  return useQuery([ServerStateKeysEnum.ServerTime], getServerTime);
};
