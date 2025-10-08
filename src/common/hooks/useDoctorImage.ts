import { useQuery } from '@tanstack/react-query';
import { getDoctorImage, DoctorImageResponse } from '@/common/apis/services/doctor/getDoctorImage';

export const useDoctorImage = (slug: string | undefined, enabled: boolean = true) => {
  return useQuery<DoctorImageResponse>(['doctorImage', slug], () => getDoctorImage(slug!), {
    enabled: enabled && !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
