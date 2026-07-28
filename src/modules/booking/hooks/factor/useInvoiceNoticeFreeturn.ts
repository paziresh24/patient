import {
  getFirstAvailableBooking,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { CENTERS } from '@/common/types/centers';
import { getFreeturnDisplayText } from '@/modules/booking/utils/getFreeturnDisplayText';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const INVOICE_NOTICE_FREETURN_API_DOCTORS = 'factor:invoice-notice-freeturn-api|doctor-list';

interface UseInvoiceNoticeFreeturnParams {
  slug: string;
  serviceId: string;
  profileFreeturnMs: number | null;
  userCenterId?: string;
  isProfileLoading: boolean;
}

export const useInvoiceNoticeFreeturn = ({
  slug,
  serviceId,
  profileFreeturnMs,
  userCenterId,
  isProfileLoading,
}: UseInvoiceNoticeFreeturnParams) => {
  const doctorList = useFeatureValue<{ slugs: string[] }>(INVOICE_NOTICE_FREETURN_API_DOCTORS, { slugs: [] });
  const useNewApi = newApiFeatureFlaggingCondition(doctorList?.slugs ?? [], slug);
  const hasRequiredParams = Boolean(serviceId && userCenterId);

  const firstAvailableQuery = useQuery({
    queryKey: ['firstAvailableBooking', CENTERS.CONSULT, serviceId, userCenterId],
    queryFn: () =>
      getFirstAvailableBooking({
        center_id: CENTERS.CONSULT,
        service_id: serviceId,
        user_center_id: userCenterId!,
      }),
    enabled: useNewApi && hasRequiredParams,
    staleTime: 0,
    cacheTime: 0,
    retry: (failureCount, error) => axios.isAxiosError(error) && !error.response && failureCount < 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const freeturnMs = useNewApi ? mapFirstAvailableFreeturnMs(firstAvailableQuery.data) : profileFreeturnMs;

  const isFreeturnLoading = useNewApi && (isProfileLoading || (hasRequiredParams && firstAvailableQuery.isLoading));

  return {
    freeturnText: getFreeturnDisplayText(freeturnMs),
    isFreeturnLoading,
    useNewApi,
  };
};
