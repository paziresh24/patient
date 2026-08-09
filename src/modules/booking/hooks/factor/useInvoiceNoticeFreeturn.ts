import {
  getFirstAvailableBooking,
  mapFirstAvailableFreeturnMs,
} from '@/common/apis/services/booking/getFirstAvailableBooking';
// Previous (main): Saman availability for freeturn text — restore if needed.
// import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
// Previous GrowthBook rollout gate — restore if we need to fall back to profile freeturns_info.
// import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { CENTERS } from '@/common/types/centers';
// import {
//   formatSamanAvailabilityTime,
//   getScopedOnlineVisitAvailability,
// } from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import { getFreeturnDisplayText } from '@/modules/booking/utils/getFreeturnDisplayText';
// import { useFeatureValue } from '@growthbook/growthbook-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Previous feature key: 'factor:invoice-notice-freeturn-api|doctor-list'
// export const INVOICE_NOTICE_FREETURN_API_DOCTORS = 'factor:invoice-notice-freeturn-api|doctor-list';

interface UseInvoiceNoticeFreeturnParams {
  // slug: string; // needed again if Saman or GrowthBook doctor-list gate is restored
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
  // Previous (main): freeturn from Saman doctor availability by slug.
  // const samanAvailability = useSamanDoctorAvailabilityStatus(slug, {
  //   enabled: !!slug,
  // });
  // const onlineAvailability = getScopedOnlineVisitAvailability([{ id: CENTERS.CONSULT }], samanAvailability.data);
  // const formatted = formatSamanAvailabilityTime(onlineAvailability.nearestTimeSlot);
  // return {
  //   freeturnText: formatted || getFreeturnDisplayText(null),
  //   isFreeturnLoading: !!slug && samanAvailability.isLoading,
  // };

  // Previous GrowthBook: only call first-available when slug matched doctor-list (incl. '*').
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
    // Previous GrowthBook: enabled: useNewApi && hasRequiredParams,
    enabled: hasRequiredParams,
    staleTime: 0,
    cacheTime: 0,
    retry: (failureCount, error) => axios.isAxiosError(error) && !error.response && failureCount < 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Previous GrowthBook: freeturnMs = useNewApi ? mapFirstAvailableFreeturnMs(...) : profileFreeturnMs
  const freeturnMs = mapFirstAvailableFreeturnMs(firstAvailableQuery.data);

  // Previous GrowthBook: isFreeturnLoading = useNewApi && (isProfileLoading || ...)
  const isFreeturnLoading = isProfileLoading || (hasRequiredParams && firstAvailableQuery.isLoading);

  return {
    freeturnText: getFreeturnDisplayText(freeturnMs),
    isFreeturnLoading,
    // useNewApi, // restore with GrowthBook gate above
  };
};
