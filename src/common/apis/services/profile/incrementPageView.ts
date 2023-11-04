import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  id?: string;
}

const incrementPageView = ({ id }: Params) => {
  return apiGatewayClient.patch(`/v1/providers/${id}/increment-page-view`);
};

export const useIncrementPageView = () => useMutation(incrementPageView);
