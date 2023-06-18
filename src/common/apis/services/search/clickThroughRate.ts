import { useMutation } from '@tanstack/react-query';
import getConfig from 'next/config';
import { clinicClient } from '../../client';
import { setTerminal } from '../auth/setTerminal';
const { publicRuntimeConfig } = getConfig();

export interface Params {
  terminal_id: string;
  query_id: string;
  position: number;
  id: string;
  server_id: number;
  type: string;
  order?: string;
}

export const clickThroughRate = async (params: Params) => {
  await setTerminal();
  return clinicClient.post(`/api/sv2ctr`, params);
};

export const useClickThroughRate = () => useMutation(clickThroughRate);
