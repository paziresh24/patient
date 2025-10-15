import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { samanClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import InActiveDoctor from './inActiveDoctor';
import FutureBookingDoctor from './FutureBookingDoctor';

interface SamanBookingProps {
  displayName: string;
  slug: string;
}

interface AvailabilityData {
  booking_available: boolean;
  nearest_time_slot: string | null;
  nearest_available_time: string | null;
}

interface AvailabilityResponse {
  in_person_availability: AvailabilityData;
  online_visit_availability: AvailabilityData;
}

const SamanBooking = ({ slug, displayName }: SamanBookingProps) => {
  const router = useRouter();

  const {
    data: availabilityData,
    isLoading,
    error,
  } = useQuery<AvailabilityResponse>({
    queryKey: ['saman-availability', slug],
    queryFn: async () => {
      const university = false;
      const params = new URLSearchParams();
      if (university) {
        params.append('university', university);
      }

      const response = await samanClient.get(`/api/doctors/${slug}/availability-status?${params.toString()}`);
      return response.data;
    },
    enabled: !!slug,
  });

  // const handleBookNow = () => {
  //   // Navigate to booking page with saman parameters
  //   const params = new URLSearchParams();
  //   if (university) {
  //     params.append('university', university);
  //   }
  //   params.append('provider', 'saman');

  //   router.push(`/booking/${slug}?${params.toString()}`);
  // };

  // const handleUseAnotherDoctor = () => {
  //   // Navigate to search page or show alternative doctors
  //   router.push('/s?q=' + encodeURIComponent('پزشک'));
  // };

  if (isLoading) {
    return <Skeleton w="100%" h="120px" rounded="lg" />;
  }

  const { in_person_availability, online_visit_availability } = availabilityData ?? {};

  // Check if any type of booking is available
  const isAnyBookingAvailable = in_person_availability?.booking_available || online_visit_availability?.booking_available;

  // Get the nearest available time from either type
  const nearestAvailableTime = in_person_availability?.nearest_available_time || online_visit_availability?.nearest_available_time;

  return (
    <div className="flex flex-col space-y-3">
      {!isAnyBookingAvailable && !nearestAvailableTime && <InActiveDoctor displayName={displayName} />}
      {!in_person_availability?.booking_available && in_person_availability?.nearest_available_time && (
        <FutureBookingDoctor availableTime={in_person_availability.nearest_available_time || ''} />
      )}
    </div>
  );
};

export default SamanBooking;
