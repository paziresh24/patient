import { averageRates } from '@/common/apis/services/rate/averageRates';
import { countOfFeedbacks } from '@/common/apis/services/rate/countOfFeedbacks';
import { satisfactionPercent } from '@/common/apis/services/rate/satisfactionPercent';

type GetRateDetailsData = { slug: string };

export const getRateDetailsData = async ({ slug }: GetRateDetailsData) => {
  const [averageRatesRes, countOfFeedbacksRes, satisfactionPercentRes] = await Promise.allSettled([
    averageRates({ slug }),
    countOfFeedbacks({ slug }),
    satisfactionPercent({ slug }),
  ]);

  return {
    averageRates:
      averageRatesRes.status === 'fulfilled'
        ? Object.entries(averageRatesRes.value?.result).reduce((prev, current) => {
            prev = {
              ...prev,
              [current[0]]: (current[1] as number).toFixed(1),
            };
            return prev;
          }, {})
        : {},
    countOfFeedbacks: countOfFeedbacksRes.status === 'fulfilled' ? countOfFeedbacksRes.value?.result : undefined,
    satisfactionPercent: satisfactionPercentRes.status === 'fulfilled' ? Math.round(satisfactionPercentRes.value?.result) : undefined,
  };
};
