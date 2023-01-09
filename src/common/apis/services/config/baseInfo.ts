import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useQuery } from 'react-query';
import { setTerminal } from '../auth/setTerminal';

export interface Params {
  table: Array<'province' | 'all_city' | 'city' | 'city_centers' | 'group_expertises' | 'expertise' | 'relation_group_expertise'>;
}

export const baseInfo = ({ table }: Params) => {
  setTerminal();
  return clinicClient.post(
    `/api/getbaseinfo`,
    formData({
      table: `[${table?.map(item => `"${item}"`)}]`,
      terminal_id: getCookie('terminal_id'),
    }),
  );
};

export const useGetBaseInfo = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.BaseInfo, params], () => baseInfo(params), options);
};
