import { useQuery } from '@tanstack/react-query';
import { getDoctorFullName, DoctorFullNameResponse } from '@/common/apis/services/doctor/getDoctorFullName';
import { splunkInstance } from '@/common/services/splunk';

export const useDoctorFullName = (slug: string | undefined, enabled: boolean = true) => {
  return useQuery<DoctorFullNameResponse>(['doctorFullName', slug], () => getDoctorFullName(slug!), {
    enabled: enabled && !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    onError: (error) => {
      // Log error to Splunk when query fails
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_fullname_hook_error',
        type: 'hook_error',
        event: {
          slug: slug,
          error_message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
      });
    },
  });
};
