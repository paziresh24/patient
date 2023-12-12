import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  channel_id: string;
}

export const easyChannels = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/channels/${params.channel_id}`);
};

export const useEasyChannels = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['channels', params], () => easyChannels(params), { ...option });
