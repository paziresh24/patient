import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

export const getDoctorProfile = async () => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return paziresh24AppClient.get(endpoints?.doctor_full_profile ?? `/V1/doctor/profile`);
};

export const useGetDoctorProfile = (options?: any) => {
  return useMutation(getDoctorProfile);
};
