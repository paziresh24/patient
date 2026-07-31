import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { doctorHomeQueryDefaults } from '../utils/doctorHomeQuery';

export interface SanjeScoreResponse {
  final_score?: number;
}

export const getSanjeScore = async () => {
  const { data } = await apiGatewayClient.get<SanjeScoreResponse>('/v1/n8n-search/webhook/growth-opportunities', {
    timeout: 5000,
  });
  return data;
};

export const useSanjeScore = (enabled = true) =>
  useQuery(['doctorHome', 'sanjeScore'], getSanjeScore, {
    enabled,
    ...doctorHomeQueryDefaults,
    retry: 1,
  });
