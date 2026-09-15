import { Fragment2 } from '@/common/fragment/fragment2';
import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { shouldShowRismanExternalBooking } from '@/modules/profile/utils/rismanBookingVisibility';
import dynamic from 'next/dynamic';

const PlasmicRisman = dynamic(() => import('.plasmic/plasmic/risman/PlasmicRisman'));

type RismanAsideSectionProps = {
  risman: unknown;
  slug: string;
  centers: { id: string }[];
  partnerKey?: string;
};

export const RismanAsideSection = ({ risman, slug, centers, partnerKey }: RismanAsideSectionProps) => {
  const samanAvailability = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug,
  });

  const samanStatus: 'pending' | 'success' | 'error' = samanAvailability.isError
    ? 'error'
    : samanAvailability.data
      ? 'success'
      : 'pending';

  const show =
    !partnerKey && shouldShowRismanExternalBooking(risman, centers ?? [], samanAvailability.data, samanStatus);

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
