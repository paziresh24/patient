import { useQuery } from '@tanstack/react-query';
import { getDoctorExpertise, DoctorExpertiseResponse } from '@/common/apis/services/doctor/getDoctorExpertise';

export const useDoctorExpertise = (slug: string | undefined, enabled: boolean = true) => {
  return useQuery<DoctorExpertiseResponse[]>(['doctorExpertise', slug], () => getDoctorExpertise(slug!), {
    enabled: enabled && !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
