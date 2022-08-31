import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from 'react-query';

export interface Params {
  table: ['province', 'all_city', 'city', 'city_centers', 'group_expertises', 'expertise', 'relation_group_expertise'];
}

export const baseInfo = ({ table }: Params) => {
  return paziresh24AppClient.get(`/api/getbaseinfo/${table}/`);
};

export const useGetBaseInfo = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.DoctorFullProfile, params], () => baseInfo(params), options);
};
