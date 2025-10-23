import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface BookRequestAvailabilityParams {
  center_id: string;
  user_center_id: string;
  service_id: string;
}

interface BookRequestAvailabilityResponse {
  status: boolean;
  available_time?: string;
}

export const bookRequestAvailability = async (params: BookRequestAvailabilityParams): Promise<BookRequestAvailabilityResponse> => {
  const { data } = await apiGatewayClient.get<BookRequestAvailabilityResponse>('/v1/book-request-availability', { params });
  return data;
};

export const useBookRequestAvailability = (params: BookRequestAvailabilityParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['bookRequestAvailability', params],
    queryFn: () => bookRequestAvailability(params),
    enabled,
    retry: false,
  });
};
