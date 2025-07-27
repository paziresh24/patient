import { apiGatewayClient } from '@/common/apis/client';
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

export const getProfileData = async ({ slug, ...params }: Params) => {
  const { data } = await apiGatewayClient.get(
    params?.profile_page
      ? `${
          publicRuntimeConfig?.FULL_PROFILE_API_URL ?? serverRuntimeConfig?.FULL_PROFILE_API_URL ?? 'https://apigw.paziresh24.com'
        }/${slug}/`
      : `/v1/full-profile/${slug}/`,
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
