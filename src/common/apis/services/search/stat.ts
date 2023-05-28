import { searchClient } from '@/common/apis/client';
import { useMutation } from 'react-query';

export interface Params {
  route: string;
  filters: Record<string, string | string[]>;
  result: any[];
  centerTypeFilterPresence?: number;
}

export const stat = (params: Params) => {
  return searchClient.post(`/seapi/stat`, params);
};

export const useStat = () => useMutation(stat);
