import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { samanClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import moment from 'jalali-moment';
import { useRouter } from 'next/router';
import Card from '@/common/components/atom/card';
import InActiveDoctor from './inActiveDoctor';

interface SamanBookingProps {
  displayName: string;
  slug: string;
}

interface AvailabilityResponse {
  booking_available: boolean;
  nearest_time_slot: string | null;
  nearest_available_time: string | null;
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

  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;

    return moment(timeString).locale('fa').calendar(undefined, {
      sameDay: '[امروز] ساعت HH:mm',
      nextDay: '[فردا] ساعت HH:mm',
      sameElse: 'jD jMMMM ساعت HH:mm',
    });
  };

  if (isLoading) {
    return <Skeleton w="100%" h="120px" rounded="lg" />;
  }

  const { booking_available, nearest_time_slot, nearest_available_time } = availabilityData ?? {};

  return (
    <div className="flex flex-col space-y-3">
      <Card className="space-y-3 !rounded-none md:!rounded-lg">
        {!booking_available && !nearest_available_time && <InActiveDoctor displayName={displayName} />}
      </Card>
    </div>
  );
};

export default SamanBooking;
