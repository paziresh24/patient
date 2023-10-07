import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface SpecialitiesParams {
  provider_id: string;
}

export const specialities = async (params: SpecialitiesParams) => {
  return await apiGatewayClient.get(`/v1/providers-specialities`, { params });
};

export const useSpecialities = (params: SpecialitiesParams) => useQuery(['specialities', params], () => specialities(params));
