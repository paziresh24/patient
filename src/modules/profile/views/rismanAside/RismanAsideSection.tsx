import { Fragment2 } from '@/common/fragment/fragment2';
import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { shouldShowRismanExternalBooking } from '@/modules/profile/utils/rismanBookingVisibility';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';

const PlasmicRisman = dynamic(() => import('.plasmic/plasmic/risman/PlasmicRisman'));

type RismanAsideSectionProps = {
  risman: unknown;
  slug: string;
  centers: { id: string }[];
  partnerKey?: string;
  ssrUseSamanAvailabilityStatus?: boolean;
};

export const RismanAsideSection = ({
  risman,
  slug,
  centers,
  partnerKey,
  ssrUseSamanAvailabilityStatus = false,
}: RismanAsideSectionProps) => {
  const featureUseSamanAvailabilityStatus = useFeatureIsOn('use-saman-availability-status');
  const useSamanAvailabilityStatus = featureUseSamanAvailabilityStatus || ssrUseSamanAvailabilityStatus;
  const samanAvailability = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug && useSamanAvailabilityStatus,
  });

  const samanStatus: 'pending' | 'success' | 'error' = !useSamanAvailabilityStatus
    ? 'error'
    : samanAvailability.isError
      ? 'error'
      : samanAvailability.data
        ? 'success'
        : 'pending';

  const show =
    !partnerKey &&
    shouldShowRismanExternalBooking(risman, centers ?? [], samanAvailability.data, samanStatus);

  if (!show) return null;

  return (
    <Fragment2
      name="Risman"
      Component={PlasmicRisman}
      args={{
        data: risman,
        slug,
      }}
    />
  );
};

export default RismanAsideSection;
