import getConfig from 'next/config';
import { useMutation } from 'react-query';
const { publicRuntimeConfig } = getConfig();

export interface Params {
  route: string;
  filters: Record<string, string | string[]>;
  position: number;
  id: string;
  card_data: any;
}

export const sendPositionStatEvent = (params: Params) => {
  return fetch(`${publicRuntimeConfig.SEARCH_BASE_URL}/seapi/stat/position`, {
    body: JSON.stringify(params),
    method: 'PATCH',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useStat = () => useMutation(sendPositionStatEvent);
