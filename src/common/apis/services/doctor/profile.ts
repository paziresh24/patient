import { apiGatewayClient, paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const getDoctorProfile = async () => {
  try {
    const { data } = await apiGatewayClient.get(`/v1/doctor/profile`);
    return data?.data;
  } catch (error) {
    return {};
  }
};

export const useGetDoctorProfile = (options?: any) => {
  return useMutation(getDoctorProfile);
};
