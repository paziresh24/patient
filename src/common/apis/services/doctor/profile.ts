import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from 'react-query';

export const getDoctorProfile = async () => paziresh24AppClient.get(`/V1/doctor/profile`);

export const useGetDoctorProfile = (options?: any) => {
  return useMutation(getDoctorProfile);
};
