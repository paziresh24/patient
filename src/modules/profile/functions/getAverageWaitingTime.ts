import { averageWaitingTime } from '@/common/apis/services/reviews/averageWaitingTime';
import * as Sentry from '@sentry/nextjs';

type GetAverageWaitingTimeParams = { slug: string; start_date?: string; end_date?: string };

export const getAverageWaitingTime = async ({ slug, end_date, start_date }: GetAverageWaitingTimeParams) => {
  const { data: response } = await averageWaitingTime({ slug, end_date, start_date });

  if (!response) {
    Sentry.captureMessage(`get average waiting time: slug:${slug}`);
  }

  return {
    ...response,
  };
};
