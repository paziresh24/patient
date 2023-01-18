import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from 'react-query';

export interface Params {
  city: string;
  category: string;
  doctorId: string;
}

export const searchRecommendByDoctor = async ({ city, category, doctorId }: Params) => {
  const { data } = await searchClient.get(`/seapi/v1/recommend/${city}/${category}`, {
    params: {
      doctorId,
    },
  });
  return data;
};

export const useSearchRecommendByDoctor = (params: Params) => {
  return useQuery([ServerStateKeysEnum.Search, params], () => searchRecommendByDoctor(params));
};
