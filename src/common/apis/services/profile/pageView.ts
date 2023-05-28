import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from 'react-query';

export interface Params {
  serverId: string;
  doctorId: string;
}

export const pageView = async ({ doctorId, serverId }: Params) => {
  return await clinicClient.post(
    `/api/vicControl`,
    formData({
      owner_id: doctorId,
      type: 'doctor',
      server_id: serverId,
      gateway: 'web',
    }),
  );
};

export const usePageView = () => useMutation(pageView);
