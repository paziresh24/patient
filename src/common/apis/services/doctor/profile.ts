import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

export const getDoctorProfile = async () => {
  const { data } = await paziresh24AppClient.get(`/V1/doctor/profile`);

  return data?.data;
};

export const useGetDoctorProfile = (options?: any) => {
  return useMutation(getDoctorProfile);
};
