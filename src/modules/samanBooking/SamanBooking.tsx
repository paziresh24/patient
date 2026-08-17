import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import Card from '@/common/components/atom/card';
import InActiveDoctor from './inActiveDoctor';
import { getScopedInPersonAvailability, getScopedOnlineVisitAvailability } from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import { CENTERS } from '@/common/types/centers';

interface SamanBookingProps {
  displayName: string;
  slug: string;
  expertises?: any;
  doctorCity?: string;
  centers?: { id: string }[];
  /** MS allowlist only: when bookable, render nothing so Aside Services is the CTA. */
  deferBookableToServices?: boolean;
}

const SamanBooking = ({
  slug,
  displayName,
  expertises,
  doctorCity,
  centers = [],
  deferBookableToServices = false,
}: SamanBookingProps) => {
  const {
    data: v1AvailabilityData,
    isLoading: isV1Loading,
    isError: isV1Error,
  } = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug,
  });

  if (isV1Loading) {
    return <Skeleton w="100%" h="120px" rounded="lg" />;
  }

  const scopedCenters = centers.length > 0 ? centers : [{ id: CENTERS.CONSULT }];
  const scopedInPerson = getScopedInPersonAvailability(scopedCenters, v1AvailabilityData);
  const scopedOnline = getScopedOnlineVisitAvailability(scopedCenters, v1AvailabilityData);

  const futureAvailableTime = scopedInPerson.nearestAvailableTime || scopedOnline.nearestAvailableTime || null;
  const hasFutureAvailableTime = !!futureAvailableTime;
  const nothingBookable = !isV1Error && !!v1AvailabilityData && !scopedInPerson.bookingAvailable && !scopedOnline.bookingAvailable;
  const showUnavailableState = nothingBookable;

  // MS allowlist: bookable → no CTA here; Aside Services handles booking.
  if (deferBookableToServices && !showUnavailableState) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3">
      <Card className="space-y-3 !rounded-none md:!rounded-lg">
        {showUnavailableState && (
          <InActiveDoctor
            displayName={displayName}
            expertises={expertises}
            doctorCity={doctorCity}
            availableTime={hasFutureAvailableTime ? futureAvailableTime : undefined}
            showSubstituteButton={!hasFutureAvailableTime}
          />
        )}
      </Card>
    </div>
  );
};

export default SamanBooking;
