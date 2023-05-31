import formData from '@/common/utils/formData';
import getConfig from 'next/config';
import { useMutation } from '@tanstack/react-query';
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

export const ctr = (params: Params) => {
  return fetch(`${publicRuntimeConfig.CLINIC_BASE_URL}/api/sv2ctr`, {
    body: formData(params),
    method: 'POST',
    keepalive: true,
  });
};

export const useCtr = () => useMutation(ctr);
