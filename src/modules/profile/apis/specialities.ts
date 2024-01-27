import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface SpecialitiesParams {
  provider_id: string;
}

export const specialities = async (params: SpecialitiesParams) => {
  return await apiGatewayClient.get(`/v1/providers-specialities`, { params });
};

export const useSpecialities = () => useMutation(specialities);
