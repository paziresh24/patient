import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useServerQuery from '@/common/hooks/useServerQuery';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  slug: string;
  university?: string;
}

export const getProfileData = async ({ slug, ...params }: Params) => {
  const { data } = await paziresh24AppClient.get(`/doctor/v1/full-profile/${slug}/`, { params });
  return data;
};

export const useGetProfileData = (params: Params, options?: any) => {
  const university = useServerQuery(state => state.queries?.university);

  return useQuery(
    [ServerStateKeysEnum.DoctorFullProfile, params],
    () => getProfileData({ ...params, ...(university && { university }) }),
    options,
  );
};
