import { sendEvent } from '@/common/services/sendEvent';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export interface Params {
  route: string;
  filters: Record<string, string | string[]>;
  position: number;
  id: string;
  card_data: any;
}

export const sendPositionStatEvent = (params: Params) => {
  return sendEvent(`${publicRuntimeConfig.SEARCH_BASE_URL}/seapi/stat/position`, params);
};
