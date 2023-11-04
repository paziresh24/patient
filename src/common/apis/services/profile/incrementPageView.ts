import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  provider_id: string;
}

export const incrementPageView = async ({ provider_id }: Params) => {
  return await apiGatewayClient.patch(`/v1/providers/${provider_id}/increment-page-view`);
};

export const useIncrementPageView = () => useMutation(incrementPageView);
