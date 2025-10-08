import { useQuery } from '@tanstack/react-query';
import { getDoctorFullName, DoctorFullNameResponse } from '@/common/apis/services/doctor/getDoctorFullName';

export const useDoctorFullName = (slug: string | undefined, enabled: boolean = true) => {
  return useQuery<DoctorFullNameResponse>(['doctorFullName', slug], () => getDoctorFullName(slug!), {
    enabled: enabled && !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
