import { searchClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

export interface Params {
  route: string;
  filters: Record<string, string | string[]>;
  result: any[];
  centerTypeFilterPresence?: number;
}

export const stat = async (params: Params) => {
  await setTerminal();
  return searchClient.post(`/seapi/stat`, params);
};

export const useStat = () => useMutation(stat);
