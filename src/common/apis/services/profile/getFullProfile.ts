import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useCustomize from '@/common/hooks/useCustomize';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  slug: string;
  university?: string;
}

export const getProfileData = async ({ slug, ...params }: Params) => {
  const { data } = await apiGatewayClient.get(`/v1/full-profile/${slug}/`, { params, timeout: 2000 });
  return data;
};

export const useGetProfileData = (params: Params, options?: any) => {
  const university = useCustomize(state => state.customize?.partnerKey);

  return useQuery(
    [ServerStateKeysEnum.DoctorFullProfile, params],
    () => getProfileData({ ...params, ...(university && { university }) }),
    options,
  );
};
