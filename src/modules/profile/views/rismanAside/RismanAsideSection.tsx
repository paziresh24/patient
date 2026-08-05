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
  isBulk: boolean;
  partnerKey?: string;
  ssrUseSamanAvailabilityStatus?: boolean;
};

export const RismanAsideSection = ({
  risman,
  slug,
  centers,
  isBulk,
  partnerKey,
  ssrUseSamanAvailabilityStatus = false,
}: RismanAsideSectionProps) => {
  const featureUseSamanAvailabilityStatus = useFeatureIsOn('use-saman-availability-status');
  const useSamanAvailabilityStatus = featureUseSamanAvailabilityStatus || ssrUseSamanAvailabilityStatus;
  const samanAvailability = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug && useSamanAvailabilityStatus,
  });
  const samanLoaded = useSamanAvailabilityStatus && !!samanAvailability.data && !samanAvailability.isError;
  const samanResolved = !useSamanAvailabilityStatus || samanLoaded || samanAvailability.isError;

  const show =
    !partnerKey &&
    shouldShowRismanExternalBooking(risman, centers ?? [], samanAvailability.data, isBulk, samanResolved);

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
