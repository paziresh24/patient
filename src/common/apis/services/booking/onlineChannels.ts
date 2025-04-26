import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

interface Params {
  book_id: string;
}

export const onlineChannels = ({ book_id }: Params) => {
  return apiGatewayClient.get(`/core-booking/v1/appointments/${book_id}/possible-online-channels`);
};

export const useGetOnlineChannels = (params: Params) => {
  return useQuery([ServerStateKeysEnum.OnlineChannels, params], () => onlineChannels(params));
};
