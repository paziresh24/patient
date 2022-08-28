import { useQuery } from 'react-query';
import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/ServerStateKeysEnum';

export interface Params {
  slug: string;
}

export const getProfileData = ({ slug }: Params) => {
  return paziresh24AppClient.get(`/doctor/v1/full-profile/${slug}/`);
};

export const useGetProfileData = (params: Params) => {
  return useQuery([ServerStateKeysEnum.DoctorFullProfile, params], () => getProfileData(params));
};
