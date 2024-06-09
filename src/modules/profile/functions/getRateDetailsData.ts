import { averageRates } from '@/common/apis/services/rate/averageRates';
import { countOfFeedbacks } from '@/common/apis/services/rate/countOfFeedbacks';
import { satisfactionPercent } from '@/common/apis/services/rate/satisfactionPercent';
import { rate } from '@/common/apis/services/reviews/rate';

type GetRateDetailsData = { slug: string; version: number };

export const getRateDetailsData = async ({ slug, version }: GetRateDetailsData) => {
  if (version === 1) {
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
  }

  if (version === 2) {
    const rateRes = await rate({ slug });
    const reteData = rateRes.list?.[0];

    return {
      averageRates: {
        average_quality_of_treatment: reteData?.quality_of_treatment?.toFixed(1) ?? null,
        average_doctor_encounter: reteData?.doctor_encounter?.toFixed(1) ?? null,
        average_explanation_of_issue: reteData?.explanation_of_issue?.toFixed(1) ?? null,
      },
      hide_rates: Boolean(reteData?.hide_rates) ?? false,
      countOfFeedbacks: reteData?.count_rates ?? null,
    };
  }
};
