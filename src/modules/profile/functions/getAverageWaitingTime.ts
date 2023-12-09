import { averageWaitingTime } from '@/common/apis/services/reviews/averageWaitingTime';
import { CENTERS } from '@/common/types/centers';
import { isEmpty } from 'lodash';

type GetAverageWaitingTimeParams = { slug: string; start_date?: string; end_date?: string; limit?: number };

export const getAverageWaitingTime = async ({ slug, end_date, start_date, limit }: GetAverageWaitingTimeParams) => {
  const { data: response } = await averageWaitingTime({ slug, end_date, start_date });

  if (isEmpty(response?.result?.find((item: any) => item.center_id === CENTERS.CONSULT)?.waiting_time_title)) {
    const { data: response } = await averageWaitingTime({ slug, limit });
    return {
      ...response,
    };
  }

  return {
    ...response,
  };
};
