import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from 'react-query';

export const getServerTime = () => {
  return paziresh24AppClient.get('/V1/time');
};
export const useGetServerTime = () => {
  return useQuery(ServerStateKeysEnum.ServerTime, getServerTime);
};
