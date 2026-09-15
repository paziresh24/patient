import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { doctorHomeListQueryDefaults } from '../utils/doctorHomeQuery';
import { normalizeGrowthPath, type GrowthPath } from './growthPath';

export type { GrowthPath, GrowthPathStep, GrowthPathStepState } from './growthPath';
export { getGrowthPathTeaser, normalizeGrowthPath } from './growthPath';

/** DR-33 v2 payload — only the fields doctor-home needs. */
export type GrowthOpportunitiesV2Response = {
  path?: GrowthPath | null;
  final_score?: number;
};

export const getGrowthOpportunitiesV2 = async (): Promise<GrowthOpportunitiesV2Response> => {
  const { data } = await apiGatewayClient.get<GrowthOpportunitiesV2Response>(
    '/v1/n8n-search/webhook/growth-opportunities',
    {
      params: { v: 2 },
      timeout: 12_000,
    },
  );
  return data ?? {};
};

export const useGrowthPath = (enabled = true) =>
  useQuery(['doctorHome', 'growthPath', 'v2'], getGrowthOpportunitiesV2, {
    enabled,
    ...doctorHomeListQueryDefaults,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: data => normalizeGrowthPath(data?.path),
  });
