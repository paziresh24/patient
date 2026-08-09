import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { samanClient } from '@/common/apis/client';
import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useQuery } from '@tanstack/react-query';
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
  ssrUseSamanAvailabilityStatus?: boolean;
  /** MS allowlist only: when bookable, render nothing so Aside Services is the CTA. */
  deferBookableToServices?: boolean;
}

interface LegacyAvailabilityResponse {
  booking_available: boolean;
  nearest_time_slot: string | null;
  nearest_available_time: string | null;
}

const SamanBooking = ({
  slug,
  displayName,
  expertises,
  doctorCity,
  centers = [],
  ssrUseSamanAvailabilityStatus = false,
  deferBookableToServices = false,
}: SamanBookingProps) => {
  const featureUseSamanAvailabilityStatus = useFeatureIsOn('use-saman-availability-status');
  const useSamanAvailabilityStatus = featureUseSamanAvailabilityStatus || ssrUseSamanAvailabilityStatus;

  const {
    data: v1AvailabilityData,
    isLoading: isV1Loading,
    isError: isV1Error,
  } = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug && useSamanAvailabilityStatus,
  });

  const {
    data: legacyAvailabilityData,
    isLoading: isLegacyLoading,
  } = useQuery<LegacyAvailabilityResponse>({
    queryKey: ['saman-availability', slug],
    queryFn: async () => {
      const response = await samanClient.get(`/api/doctors/${encodeURIComponent(slug)}/availability-status`);
      return response.data;
    },
    enabled: !!slug && !useSamanAvailabilityStatus,
  });

  if ((useSamanAvailabilityStatus && isV1Loading) || (!useSamanAvailabilityStatus && isLegacyLoading)) {
    return <Skeleton w="100%" h="120px" rounded="lg" />;
  }

  const scopedCenters = centers.length > 0 ? centers : [{ id: CENTERS.CONSULT }];
  const scopedInPerson = getScopedInPersonAvailability(scopedCenters, v1AvailabilityData);
  const scopedOnline = getScopedOnlineVisitAvailability(scopedCenters, v1AvailabilityData);

  const futureAvailableTime =
    scopedInPerson.nearestAvailableTime || scopedOnline.nearestAvailableTime || legacyAvailabilityData?.nearest_available_time || null;

  const hasFutureAvailableTime = !!futureAvailableTime;

  const nothingBookable = useSamanAvailabilityStatus
    ? !isV1Error && !!v1AvailabilityData && !scopedInPerson.bookingAvailable && !scopedOnline.bookingAvailable
    : !legacyAvailabilityData?.booking_available;

  // Show inactive/future box when nothing is bookable now (with or without future available_time)
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
