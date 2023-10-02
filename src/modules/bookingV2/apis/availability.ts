import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface AvailabilityParams {
  membership_id: string;
  service_id: string;
  start_time?: string;
  end_time?: string;
  timezone?: string;
}

export const availability = async (params: AvailabilityParams) => {
  return await apiGatewayClient.get(`/v1/availability`, { params });
};

export const useAvailability = () => useMutation(availability);
