import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface QuerySuggestionParams {
  query: string;
  inContent?: boolean;
  spellCheckEnabled?: boolean;
}

export interface QuerySuggestionResponse {
  statusType: string;
  details: string;
  entity: {
    topQuerySuggestions: string[];
    topQuerySuggestionsIncludeDocCount: Array<{
      query: string;
      docCount: number;
    }>;
    topQuerySuggestionsIncludeCategory: Array<{
      query: string;
      category: {
        group_expertise?: string[];
      };
      docCount: number;
    }>;
    searchTime: number;
  };
  path: string;
}

export const getQuerySuggestions = async ({ query, inContent = true, spellCheckEnabled = true }: QuerySuggestionParams): Promise<QuerySuggestionResponse> => {
  try {
    const { data } = await apiGatewayClient.get('/v1/searchia-api/v2/qs/index/slim_clinic_query_su', {
      params: {
        query,
        inContent,
        spellCheckEnabled,
      },
      headers: {
        'apikey': 'gwiuATzYDmeayT7eqmbHG2obv6lGpqJa',
      },
      timeout: 5000,
    });
    return data;
  } catch (error) {
    console.error('Error getting query suggestions:', error);
    // Return empty suggestions instead of throwing to avoid breaking the UI
    return {
      statusType: 'ERROR',
      details: 'Suggestions failed',
      entity: {
        topQuerySuggestions: [],
        topQuerySuggestionsIncludeDocCount: [],
        topQuerySuggestionsIncludeCategory: [],
        searchTime: 0,
      },
      path: '/api/v2/qs/index/slim_clinic_query_su',
    };
  }
};

export const useQuerySuggestions = (params: QuerySuggestionParams, options?: any) => {
  return useQuery(
    [ServerStateKeysEnum.SearchSuggestion, 'query-suggestion', params],
    () => getQuerySuggestions(params),
    {
      enabled: !!params.query && params.query.length > 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Only retry once for suggestions
      retryDelay: 500, // Quick retry
      ...options,
    }
  );
};