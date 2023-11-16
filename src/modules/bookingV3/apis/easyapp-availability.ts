import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface AvailabilityParams {
  provider_id: string;
  service_id: string;
}

export const easyAvailability = async (params: AvailabilityParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/availabilities`, { params });
};

export const useEasyAvailability = () => useMutation(easyAvailability);
