import { apiGatewayClient } from '@/common/apis/client';

export interface SubscribeNotificationParams {
  device_token: string;
  platform: string;
  os: string;
}

export interface SubscribeNotificationResponse {
  success: boolean;
  message?: string;
}

export const subscribeNotification = async (
  params: SubscribeNotificationParams
): Promise<SubscribeNotificationResponse> => {
  const { data } = await apiGatewayClient.post<SubscribeNotificationResponse>('/v1/notification/subscribers', params);
  return data;
};
