import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { samanClient } from '@/common/apis/client';
import { getDoctorCenters, DoctorCentersResponse } from '@/common/apis/services/doctor/getDoctorCenters';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import Button from '@/common/components/atom/button/button';
import Divider from '@/common/components/atom/divider/divider';
import ChevronIcon from '@/common/components/icons/chevron';
import HospitalIcon from '@/common/components/icons/hospital';
import OfficeIcon from '@/common/components/icons/office';
import PhoneIcon from '@/common/components/icons/phone';
import classNames from '@/common/utils/classNames';
import { formatTime } from '@/common/utils/formatTime';
import PhoneNumberList from '../booking/components/phoneNumberList/phoneNumberList';

interface SamanBookingFlowProps {
  slug: string;
  displayName: string;
  university?: string;
  onCenterSelect?: (center: DoctorCentersResponse) => void;
}

interface AvailabilityData {
  booking_available: boolean;
  nearest_time_slot: string | null;
  nearest_available_time: string | null;
}

interface CenterAvailability {
  id: string;
  availability_status: AvailabilityData;
}

interface AvailabilityResponse {
  in_person_availability: AvailabilityData;
  online_visit_availability: AvailabilityData;
  centers: CenterAvailability[];
}

interface SamanCenterCardProps {
  center: DoctorCentersResponse;
  availability?: AvailabilityData;
  onClick: (center: DoctorCentersResponse) => void;
  isAvailable: boolean;
  isDisabled: boolean;
}

const SamanCenterCard = ({ center, availability, onClick, isAvailable, isDisabled }: SamanCenterCardProps) => {
  const { id, name, address, tell, type_id } = center;

  const getCenterType = (typeId: number) => {
    switch (typeId) {
      case 1:
        return 'office';
      default:
        return 'hospital';
    }
  };

  const centerType = getCenterType(type_id);
  const IconComponent = centerType === 'hospital' ? HospitalIcon : OfficeIcon;

  const handleClick = () => {
    if (!isDisabled && isAvailable) {
      onClick(center);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={classNames('w-full rounded-lg border-2 border-slate-200 cursor-pointer shadow-sm', {
        'cursor-default': isDisabled || !isAvailable,
      })}
    >
      <div
        className={classNames('p-3', {
          "relative after:content-[''] opacity-65 after:absolute after:inset-0 after:pointer-events-none after:[background-image:repeating-linear-gradient(135deg,rgba(0,0,0,0.05)_0_2px,transparent_2px_7px)]":
            isDisabled,
        })}
      >
        <div className="flex items-center w-full">
          <div className="flex justify-between items-center w-full text-sm">
            <Text className={classNames('line-clamp-1 font-semibold', { 'text-primary': !isDisabled && isAvailable })}>{name}</Text>
            <ChevronIcon dir="left" className="min-w-2" />
          </div>
        </div>
        {!!address && (
          <Text fontSize="xs" className="w-full mt-1 text-slate-400 line-clamp-1">
            {address}
          </Text>
        )}
      </div>

      {/* Availability Information */}
      {availability && !isDisabled && (
        <div className="pb-3">
          <Divider className="mb-3" />
          <div className="px-3">
            {availability.booking_available ? (
              <div className="flex justify-between w-full">
                <Text className="text-black">اولین نوبت خالی:</Text>
                <Text className="block" fontWeight="semiBold">
                  {availability.nearest_time_slot ? formatTime(availability.nearest_time_slot) : 'در دسترس'}
                </Text>
              </div>
            ) : availability.nearest_available_time ? (
              <div className="flex justify-between w-full">
                <Text className="text-black">زودترین زمان موجود:</Text>
                <Text className="block" fontWeight="semiBold">
                  {formatTime(availability.nearest_available_time)}
                </Text>
              </div>
            ) : (
              <Text fontSize="sm" className="text-slate-600 text-center">
                در حال حاضر نوبت خالی وجود ندارد
              </Text>
            )}
          </div>
        </div>
      )}

      {/* Disabled State */}
      {isDisabled && (
        <>
          <Divider />
          <div className="w-full p-3">
            <Text fontSize="sm" align="center" fontWeight="bold" className="block">
              نوبت دهی اینترنتی در این {centerType === 'office' ? 'مطب' : 'مرکز'} غیر فعال است.
            </Text>
            {tell && tell.length > 0 && <PhoneNumberList phoneNumbers={tell} type={centerType} />}
          </div>
        </>
      )}

      {/* Not Available State */}
      {!isAvailable && !isDisabled && (
        <>
          <Divider />
          <div className="w-full p-3">
            <Text fontSize="sm" align="center" fontWeight="bold" className="block text-slate-600">
              در حال حاضر نوبت خالی وجود ندارد
            </Text>
            {availability?.nearest_available_time && (
              <Text fontSize="xs" className="text-center mt-1 text-slate-500">
                زودترین زمان موجود: {formatTime(availability.nearest_available_time)}
              </Text>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const SamanBookingFlow = ({ slug, displayName, university, onCenterSelect }: SamanBookingFlowProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'SELECT_CENTER' | 'SELECT_SERVICES' | 'SELECT_TIME' | 'SELECT_USER'>('SELECT_CENTER');
  const [selectedCenter, setSelectedCenter] = useState<DoctorCentersResponse | null>(null);

  // Check if samanBooking is enabled
  const isSamanBookingEnabled = useFeatureIsOn('saman-booking');

  // Get doctor centers
  const {
    data: doctorCenters,
    isLoading: isCentersLoading,
    error: centersError,
  } = useQuery<DoctorCentersResponse[]>({
    queryKey: ['doctor-centers', slug, university],
    queryFn: () => getDoctorCenters(slug, university),
    enabled: !!slug && isSamanBookingEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get availability status
  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    error: availabilityError,
  } = useQuery<AvailabilityResponse>({
    queryKey: ['saman-availability', slug, university],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (university) {
        params.append('university', university);
      }
      const response = await samanClient.get(`/api/doctors/${slug}/availability-status?${params.toString()}`);
      return response.data;
    },
    enabled: !!slug && isSamanBookingEnabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // If samanBooking is not enabled, don't render anything
  if (!isSamanBookingEnabled) {
    return null;
  }

  // Loading state
  if (isCentersLoading || isAvailabilityLoading) {
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton w="100%" h="10rem" rounded="lg" />
        <Skeleton w="100%" h="10rem" rounded="lg" />
        <Skeleton w="100%" h="10rem" rounded="lg" />
      </div>
    );
  }

  // Error state
  if (centersError || availabilityError) {
    return (
      <div className="p-4 text-center">
        <Text fontSize="sm" className="text-red-600">
          خطا در دریافت اطلاعات مراکز درمانی
        </Text>
        <Button className="mt-2" onClick={() => window.location.reload()} size="sm">
          تلاش مجدد
        </Button>
      </div>
    );
  }

  // No centers available
  if (!doctorCenters || doctorCenters.length === 0) {
    return (
      <div className="p-4 text-center">
        <Text fontSize="sm" className="text-slate-600">
          هیچ مرکز درمانی برای این پزشک یافت نشد
        </Text>
      </div>
    );
  }

  const centers = doctorCenters;
  const availabilityCenters = availabilityData?.centers || [];

  // Create a map of center availability for quick lookup
  const centerAvailabilityMap = new Map(availabilityCenters.map(center => [center.id, center.availability_status]));

  const handleCenterSelect = (center: DoctorCentersResponse) => {
    setSelectedCenter(center);
    const availability = centerAvailabilityMap.get(center.id);

    if (availability?.booking_available) {
      // If onCenterSelect callback is provided, use it (for integration with existing booking flow)
      if (onCenterSelect) {
        onCenterSelect(center);
        return;
      }

      // Otherwise, navigate to booking with center selected (standalone usage)
      const params = new URLSearchParams();
      Object.entries(router.query).forEach(([key, value]) => {
        params.append(key, value as string);
      });
      params.append('centerId', center.id);
      router.push(`/booking/${slug}?${params.toString()}`);
    }
  };

  const getCenterAvailabilityStatus = (center: DoctorCentersResponse) => {
    const availability = centerAvailabilityMap.get(center.id);

    if (!availability) {
      return {
        isAvailable: false,
        isDisabled: false,
        availability: null,
      };
    }

    const isAvailable = availability.booking_available;
    const isDisabled = !center.has_bookable_services;

    return {
      isAvailable,
      isDisabled,
      availability: availability || undefined,
    };
  };

  // Sort centers by availability and nearest time
  const sortedCenters = [...centers].sort((a, b) => {
    const aStatus = getCenterAvailabilityStatus(a);
    const bStatus = getCenterAvailabilityStatus(b);

    // Available centers first
    if (aStatus.isAvailable && !bStatus.isAvailable) return -1;
    if (!aStatus.isAvailable && bStatus.isAvailable) return 1;

    // Then by nearest available time
    const aTime = aStatus.availability?.nearest_available_time;
    const bTime = bStatus.availability?.nearest_available_time;

    if (aTime && bTime) {
      return new Date(aTime).getTime() - new Date(bTime).getTime();
    }

    if (aTime && !bTime) return -1;
    if (!aTime && bTime) return 1;

    return 0;
  });

  return (
    <div className="flex flex-col space-y-3">
      <Text className="font-bold">انتخاب مرکز درمانی</Text>

      {sortedCenters.map(center => {
        const { isAvailable, isDisabled, availability } = getCenterAvailabilityStatus(center);

        return (
          <SamanCenterCard
            key={center.id}
            center={center}
            availability={availability || undefined}
            onClick={handleCenterSelect}
            isAvailable={isAvailable}
            isDisabled={isDisabled}
          />
        );
      })}
    </div>
  );
};

export default SamanBookingFlow;
