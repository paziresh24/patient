import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export const getMegaMenu = () => {
  return clinicClient.get('/api/megaMenu');
};
export const useGetMegaMenu = () => {
  return useQuery([ServerStateKeysEnum.MenuExpertise], getMegaMenu);
};
