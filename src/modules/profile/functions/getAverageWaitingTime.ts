import { averageWaitingTime } from '@/common/apis/services/reviews/averageWaitingTime';
import * as Sentry from '@sentry/nextjs';

type GetAverageWaitingTimeParams = { slug: string };

export const getAverageWaitingTime = async ({ slug }: GetAverageWaitingTimeParams) => {
  const { data: response } = await averageWaitingTime({ slug });

  if (!response) {
    Sentry.captureMessage(`get average waiting time: slug:${slug}`);
  }

  return response?.list?.map((item: any) => ({
    ...item,
    ...(item?.avg_waiting_time && { waiting_time_title: Math.ceil(item?.avg_waiting_time / 5) * 5 + ' دقیقه' }),
  }));
};
