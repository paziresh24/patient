import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useServerQuery from '@/common/hooks/useServerQuery';
import { useQuery } from 'react-query';

export interface Params {
  query: string;
  city_id?: string;
  university?: string;
}

export const Suggestion = ({ query, city_id, university }: Params) => {
  return searchClient.get(`/seapi/v1/suggestion`, {
    params: {
      q: query,
      city_id,
      university,
    },
  });
};

export const useSearchSuggestion = (params: Params, options?: any) => {
  const university = useServerQuery(state => state.queries?.university);
  params = { ...params, ...(university && { university }) };

  return useQuery([ServerStateKeysEnum.SearchSuggestion, params], () => Suggestion(params), options);
};
