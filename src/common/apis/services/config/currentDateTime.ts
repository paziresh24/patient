import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export const currentDateTime = () => {
  return clinicClient.get(`/api/getCurrentDateTime`);
};

export const useCurrentDateTime = () => {
  return useQuery([ServerStateKeysEnum.CurrentDateTime], currentDateTime);
};
