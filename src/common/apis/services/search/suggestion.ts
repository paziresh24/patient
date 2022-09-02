import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from 'react-query';

export interface Params {
  query: string;
  city_id?: string;
}

export const Suggestion = ({ query, city_id }: Params) => {
  return clinicClient.get(`/seapi/v1/suggestion`, {
    params: {
      q: query,
      city_id,
    },
  });
};

export const useSearchSuggestion = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.SearchSuggestion, params], () => Suggestion(params), options);
};
