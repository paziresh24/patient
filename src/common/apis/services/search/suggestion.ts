import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useServerQuery from '@/common/hooks/useServerQuery';
import { useQuery } from 'react-query';

export interface Params {
  query: string;
  city_id?: string;
  expertise?: string;
  center_id?: string;
  university?: string;
  return_expertise?: boolean;
}

export const suggestion = async ({ query, ...params }: Params) => {
  const { data } = await searchClient.get(`/seapi/v1/suggestion`, {
    params: {
      q: query,
      ...params,
    },
  });
  return data;
};

export const useSearchSuggestion = (params: Params, options?: any) => {
  const university = useServerQuery(state => state.queries?.university);
  params = { ...params, ...(university && { university }) };

  return useQuery([ServerStateKeysEnum.SearchSuggestion, params], () => suggestion(params), options);
};
