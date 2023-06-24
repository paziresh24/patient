import { useMutation } from '@tanstack/react-query';
import getConfig from 'next/config';
import { searchClient } from '../../client';
import { setTerminal } from '../auth/setTerminal';
const { publicRuntimeConfig } = getConfig();

export interface Params {
  route: string;
  filters: Record<string, string | string[]>;
  position: number;
  id: string;
  card_data: any;
}

export const sendPositionStatEvent = async (params: Params) => {
  await setTerminal();
  return searchClient.patch(`/seapi/stat/position`, params);
};

export const useStat = () => useMutation(sendPositionStatEvent);
