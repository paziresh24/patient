import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

export interface Params {
  serverId: string;
  ownerId: string;
  type: string;
}

export const pageView = async ({ ownerId, serverId, type }: Params) => {
  await setTerminal();
  return await clinicClient.post(
    `/api/vicControl`,
    formData({
      owner_id: ownerId,
      type: type,
      server_id: serverId,
      gateway: 'web',
    }),
  );
};

export const usePageView = () => useMutation(pageView);
