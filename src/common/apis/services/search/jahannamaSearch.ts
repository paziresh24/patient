import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface JahannamaSearchParams {
  from?: number;
  size?: number;
  query?: string;
  lat?: number;
  lon?: number;
  fl?: string;
}

export interface DoctorSearchResult {
  indexName: string;
  documentId: string;
  documentInfo: null;
  beforePersonalizationPosition: number;
  pinned: boolean;
  contentRankingDetails: null;
  source: {
    presence_freeturn: number;
    image: string;
    star: number;
    prefix: string;
    expertise: string[];
    display_name: string;
    satisfaction: number;
    consult_active_booking: boolean;
    rate_info: {
      rates_count: number;
      doctor_encounter: number;
      explanation_of_issue: number;
      quality_of_treatment: number;
      waiting_time: number;
      comments_count: number;
      waiting_time_count: number;
      rate: number;
    };
    record_type: string;
    consult_services: Array<{
      free_price: number;
      id: string;
    }>;
    consult_freeturn: number;
    rates_count: number;
    _modification_date: number;
    slug: string;
    calculated_rate: number;
  };
  highlight: null;
  subGroupDocs: null;
  relationalIndicesSource: Record<string, any>;
}

export interface JahannamaSearchResponse {
  statusType: string;
  details: string;
  entity: {
    totalHits: number;
    ungroupedTotalHits: number;
    searchTime: number;
    queryId: string;
    results: DoctorSearchResult[];
    facets: null;
  };
  path: string;
}

export const searchDoctors = async (params: JahannamaSearchParams): Promise<JahannamaSearchResponse> => {
  const {
    from = 0,
    size = 10,
    query = '',
    lat,
    lon,
    fl = 'presence_freeturn,prefix,expertise,rate_info,consult_services,rates_count,slug,image,star,display_name,satisfaction,consult_active_booking,record_type,consult_freeturn,calculated_rate'
  } = params;

  try {
    const { data } = await apiGatewayClient.get('/v1/jahannama', {
      params: {
        from,
        size,
        query,
        ...(lat && lon && { lat, lon }), // Only include location if both are provided
        fl,
      },
      timeout: 10000,
    });
    return data;
  } catch (error) {
    console.error('Error searching doctors:', error);
    // Return empty result instead of throwing to avoid breaking the UI
    return {
      statusType: 'ERROR',
      details: 'Search failed',
      entity: {
        totalHits: 0,
        ungroupedTotalHits: 0,
        searchTime: 0,
        queryId: '',
        results: [],
        facets: null,
      },
      path: '/api/index/slim_clinic',
    };
  }
};

export const useSearchDoctors = (params: JahannamaSearchParams, options?: any) => {
  return useQuery(
    [ServerStateKeysEnum.Search, 'jahannama-search', params],
    () => searchDoctors(params),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 2, // Retry failed requests
      retryDelay: 1000, // Wait 1 second between retries
      ...options,
    }
  );
};