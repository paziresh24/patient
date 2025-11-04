import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

export interface AbsentScoreResponse {
  list: Array<{
    Id: number;
    Title: string | null;
    CreatedAt: string | null;
    UpdatedAt: string;
    slug: string;
    penalty_score: number;
  }>;
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export const getAbsentScore = async (slug: string): Promise<AbsentScoreResponse> => {
  const encodedSlug = encodeURIComponent(slug);
  const { data } = await apiGatewayClient.get<AbsentScoreResponse>(`/ravi/v1/absent_score?where=(slug,eq,${encodedSlug})`);
  return data;
};

export const useAbsentScore = (slug: string | undefined, enabled: boolean = true) => {
  return useQuery<AbsentScoreResponse>(
    ['absentScore', slug],
    () => getAbsentScore(slug!),
    {
      enabled: enabled && !!slug,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    }
  );
};

