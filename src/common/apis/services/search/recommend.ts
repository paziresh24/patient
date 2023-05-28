import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from 'react-query';

export interface Params {
  city: string;
  category: string;
  doctorId: string;
  centerId?: string;
}

export const searchRecommendByDoctor = async ({ city, category, doctorId, centerId }: Params) => {
  const { data } = await searchClient.get(`/seapi/v1/recommend/${city}/${category}`, {
    params: {
      doctor_id: doctorId,
      center_id: centerId,
      rising_stars: true,
    },
  });
  return data;
};

export const useSearchRecommendByDoctor = (params: Params) => {
  return useQuery([ServerStateKeysEnum.Search, params], () => searchRecommendByDoctor(params));
};
