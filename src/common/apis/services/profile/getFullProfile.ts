import { apiGatewayClient, drProfileClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useCustomize from '@/common/hooks/useCustomize';
import { useQuery } from '@tanstack/react-query';
import getConfig from 'next/config';
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export interface Params {
  slug: string;
  university?: string;
  profile_page?: boolean;
}

export const getProfileData = async ({ slug, profile_page, ...params }: Params) => {
  const { data } = await drProfileClient.get(
    `/api/full-profile/${encodeURIComponent(slug)}/`,
    { params, timeout: 6000 },
  );
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
