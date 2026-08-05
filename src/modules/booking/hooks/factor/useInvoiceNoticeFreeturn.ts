import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { CENTERS } from '@/common/types/centers';
import {
  formatSamanAvailabilityTime,
  getScopedOnlineVisitAvailability,
} from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import { getFreeturnDisplayText } from '@/modules/booking/utils/getFreeturnDisplayText';

interface UseInvoiceNoticeFreeturnParams {
  slug: string;
}

export const useInvoiceNoticeFreeturn = ({ slug }: UseInvoiceNoticeFreeturnParams) => {
  const samanAvailability = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug,
  });

  const onlineAvailability = getScopedOnlineVisitAvailability([{ id: CENTERS.CONSULT }], samanAvailability.data);
  const formatted = formatSamanAvailabilityTime(onlineAvailability.nearestTimeSlot);

  return {
    freeturnText: formatted || getFreeturnDisplayText(null),
    isFreeturnLoading: !!slug && samanAvailability.isLoading,
  };
};
