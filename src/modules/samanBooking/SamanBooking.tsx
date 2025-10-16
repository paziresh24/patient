import Skeleton from '@/common/components/atom/skeleton/skeleton';
import { samanClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import InActiveDoctor from './inActiveDoctor';
import FutureBookingDoctor from './FutureBookingDoctor';
import ServiceCard from '../profile/components/serviceCard';
import { formatTime } from '@/common/utils/formatTime';

interface SamanBookingProps {
  displayName: string;
  slug: string;
}

interface AvailabilityData {
  booking_available: boolean;
  nearest_time_slot: string | null;
  nearest_available_time: string | null;
}

interface Center {
  id: string;
  availability_status: AvailabilityData;
}

interface AvailabilityResponse {
  in_person_availability: AvailabilityData;
  online_visit_availability: AvailabilityData;
  centers: Center[];
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

  if (isLoading) {
    return <Skeleton w="100%" h="120px" rounded="lg" />;
  }

  const { in_person_availability, online_visit_availability, centers } = availabilityData ?? {};

  // Check if any type of booking is available
  const isAnyBookingAvailable = in_person_availability?.booking_available || online_visit_availability?.booking_available;

  // Get the nearest available time from either type
  const nearestAvailableTime = in_person_availability?.nearest_available_time || online_visit_availability?.nearest_available_time;

  // Check if there are multiple centers available
  const hasMultipleCenters =
    centers &&
    // .filter(center => center.availability_status.nearest_available_time)
    centers.length > 1;

  const navigateToBooking = () => {
    const params = new URLSearchParams();
    Object.entries(router.query).forEach(([key, value]) => {
      params.append(key, value as string);
    });
    router.push(`/booking/${slug}?${params.toString()}`);
  };

  if (!in_person_availability?.booking_available) {
    return (
      <div className="flex flex-col space-y-3">
        {!isAnyBookingAvailable && !nearestAvailableTime && <InActiveDoctor displayName={displayName} />}
        {!in_person_availability?.booking_available && in_person_availability?.nearest_available_time && (
          <FutureBookingDoctor
            availableTime={in_person_availability.nearest_available_time || ''}
            hasMultipleCenters={hasMultipleCenters}
            onNavigateToBooking={navigateToBooking}
          />
        )}
      </div>
    );
  }

  return (
    <ServiceCard
      header={{
        icon: (
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.654 3.98035C6.76757 3.98035 7.6703 3.12061 7.6703 2.06006C7.6703 0.999514 6.76757 0.139771 5.654 0.139771C4.54043 0.139771 3.6377 0.999514 3.6377 2.06006C3.6377 3.12061 4.54043 3.98035 5.654 3.98035Z"
              fill="currentColor"
            />
            <path
              d="M11.2023 8.29562C9.54185 7.38023 8.17947 6.14375 7.03265 4.68913C6.31202 3.72398 4.40678 3.77436 3.6326 4.65877C2.45489 5.75005 1.45561 6.87481 0.663016 8.00019C0.339014 8.46118 0.467827 9.08489 0.951529 9.39347C1.13193 9.50863 1.33534 9.56371 1.53743 9.56371C1.8772 9.56371 2.21106 9.40755 2.41414 9.11838C2.76213 8.62485 3.15678 8.12976 3.59382 7.63685C3.57706 8.67993 3.63194 10.562 3.65954 11.408C3.66874 11.6896 3.60138 11.965 3.46402 12.2151C2.37701 14.192 1.68168 16.0625 0.975846 18.3509C0.803001 18.9095 1.13916 19.4956 1.72539 19.66C1.85814 19.6972 1.99221 19.7097 2.12168 19.7003C2.56792 19.6678 2.96685 19.3783 3.10026 18.9458C3.75155 16.8358 4.38083 15.1274 5.36236 13.3185C5.41231 13.3204 5.46226 13.3204 5.51286 13.3182C6.1395 15.0989 6.76648 16.8806 7.39411 18.6613C7.84988 19.9591 9.96444 19.285 9.50735 17.9869C8.82156 16.04 8.13675 14.094 7.45326 12.1475C7.4135 12.0357 7.31722 11.5982 7.30374 11.4555C7.1907 10.2563 7.14963 9.0608 7.16179 7.86375C8.12394 8.74158 9.19091 9.503 10.3762 10.1571C11.5582 10.8105 12.3685 8.93937 11.2023 8.29562Z"
              fill="currentColor"
            />
          </svg>
        ),
        title: 'نوبت اینترنتی و مراجعه حضوری',
      }}
      body={{
        description: [
          'امکان دریافت زودترین نوبت',
          in_person_availability?.nearest_time_slot &&
            `اولین نوبت خالی: <strong>${formatTime(in_person_availability?.nearest_time_slot)}</strong>`,
        ].filter(Boolean) as string[],
      }}
      footer={{
        actions: [
          {
            text: 'دریافت نوبت',
            onClick: navigateToBooking,
          },
        ].filter(Boolean),
      }}
    />
  );
};

export default SamanBooking;
