import {
  getFirstAvailableBooking,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';
// Previous GrowthBook rollout gate — restore if we need to fall back to profile freeturns_info.
// import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { CENTERS } from '@/common/types/centers';
import { getFreeturnDisplayText } from '@/modules/booking/utils/getFreeturnDisplayText';
// import { useFeatureValue } from '@growthbook/growthbook-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Previous feature key: 'factor:invoice-notice-freeturn-api|doctor-list'
// export const INVOICE_NOTICE_FREETURN_API_DOCTORS = 'factor:invoice-notice-freeturn-api|doctor-list';

interface UseInvoiceNoticeFreeturnParams {
  // slug: string; // needed again if GrowthBook doctor-list gate is restored
  serviceId: string;
  // profileFreeturnMs: number | null; // fallback when doctor was not in the GB list
  userCenterId?: string;
  isProfileLoading: boolean;
}

export const useInvoiceNoticeFreeturn = ({
  // slug,
  serviceId,
  // profileFreeturnMs,
  userCenterId,
  isProfileLoading,
}: UseInvoiceNoticeFreeturnParams) => {
  // Previous: only call first-available when slug matched GrowthBook doctor-list (incl. '*').
  // const doctorList = useFeatureValue<{ slugs: string[] }>(INVOICE_NOTICE_FREETURN_API_DOCTORS, { slugs: [] });
  // const useNewApi = newApiFeatureFlaggingCondition(doctorList?.slugs ?? [], slug);
  const hasRequiredParams = Boolean(serviceId && userCenterId);

  const firstAvailableQuery = useQuery({
    queryKey: ['firstAvailableBooking', CENTERS.CONSULT, serviceId, userCenterId],
    queryFn: () =>
      getFirstAvailableBooking({
        center_id: CENTERS.CONSULT,
        service_id: serviceId,
        user_center_id: userCenterId!,
      }),
    // Previous: enabled: useNewApi && hasRequiredParams,
    enabled: hasRequiredParams,
    staleTime: 0,
    cacheTime: 0,
    retry: (failureCount, error) => axios.isAxiosError(error) && !error.response && failureCount < 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Previous: freeturnMs = useNewApi ? mapFirstAvailableFreeturnMs(...) : profileFreeturnMs
  const freeturnMs = mapFirstAvailableFreeturnMs(firstAvailableQuery.data);

  // Previous: isFreeturnLoading = useNewApi && (isProfileLoading || (hasRequiredParams && firstAvailableQuery.isLoading))
  const isFreeturnLoading = isProfileLoading || (hasRequiredParams && firstAvailableQuery.isLoading);

  return {
    freeturnText: getFreeturnDisplayText(freeturnMs),
    isFreeturnLoading,
    // useNewApi, // restore with GrowthBook gate above
  };
};
