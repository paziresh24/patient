import {
  getFirstAvailableBooking,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';
import { CENTERS } from '@/common/types/centers';
import { getFreeturnDisplayText } from '@/modules/booking/utils/getFreeturnDisplayText';
import { useNewOnlineVisitBoxEnabled } from '@/modules/profile/hooks/useNewOnlineVisitBoxEnabled';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseInvoiceNoticeFreeturnParams {
  slug: string;
  serviceId: string;
  userCenterId?: string;
  isUserCenterLoading: boolean;
}

export const useInvoiceNoticeFreeturn = ({
  slug,
  serviceId,
  userCenterId,
  isUserCenterLoading,
}: UseInvoiceNoticeFreeturnParams) => {
  const useOnlineVisitDisplayBuffer = useNewOnlineVisitBoxEnabled(slug);
  const hasRequiredParams = Boolean(serviceId && userCenterId);

  const firstAvailableQuery = useQuery({
    queryKey: ['firstAvailableBooking', CENTERS.CONSULT, serviceId, userCenterId],
    queryFn: () =>
      getFirstAvailableBooking({
        center_id: CENTERS.CONSULT,
        service_id: serviceId,
        user_center_id: userCenterId!,
      }),
    enabled: hasRequiredParams,
    staleTime: 0,
    cacheTime: 0,
    retry: (failureCount, error) => axios.isAxiosError(error) && !error.response && failureCount < 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const freeturnMs = mapFirstAvailableFreeturnMs(firstAvailableQuery.data);

  const isFreeturnLoading = isUserCenterLoading || (hasRequiredParams && firstAvailableQuery.isLoading);

  return {
    freeturnText: getFreeturnDisplayText(freeturnMs, { enabled: useOnlineVisitDisplayBuffer }),
    isFreeturnLoading,
  };
};
