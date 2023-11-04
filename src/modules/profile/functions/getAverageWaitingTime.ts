import { averageWaitingTime } from '@/common/apis/services/reviews/averageWaitingTime';
import * as Sentry from '@sentry/nextjs';

type GetAverageWaitingTimeParams = { slug: string };

export const getAverageWaitingTime = async ({ slug }: GetAverageWaitingTimeParams) => {
  const { data: response } = await averageWaitingTime({ slug });

  if (!response) {
    Sentry.captureMessage(`get average waiting time: slug:${slug}`);
  }

  return {
    ...response,
  };
};
