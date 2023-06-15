import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

interface Params {
  user_center_id: string;
  center_id: string;
  service_id: string;
}

export const existsAvailabilityNotification = (params: Params) => {
  return paziresh24AppClient.get('/V1/request-availability', { params });
};

export const useExistsAvailabilityNotification = (params: Params, config?: any) => {
  return useQuery([ServerStateKeysEnum.AvailabilityNotification, params], () => existsAvailabilityNotification(params), { ...config });
};
