import {
  getFirstAvailableBooking,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';
import { CENTERS } from '@/common/types/centers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useOnlineVisitFirstAvailable = ({
  enabled,
  serviceId,
  userCenterId,
}: {
  enabled: boolean;
  serviceId?: string;
  userCenterId?: string;
}) => {
  const hasRequiredParams = Boolean(enabled && serviceId && userCenterId);

  const query = useQuery({
    queryKey: ['firstAvailableBooking', CENTERS.CONSULT, serviceId, userCenterId],
    queryFn: () =>
      getFirstAvailableBooking({
        center_id: CENTERS.CONSULT,
        service_id: serviceId!,
        user_center_id: userCenterId!,
      }),
    enabled: hasRequiredParams,
    staleTime: 30_000,
    retry: (failureCount, error) => axios.isAxiosError(error) && !error.response && failureCount < 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    freeturnMs: mapFirstAvailableFreeturnMs(query.data),
    isLoading: hasRequiredParams && query.isLoading,
  };
};
