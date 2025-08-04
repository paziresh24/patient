import { averageRates } from '@/common/apis/services/rate/averageRates';
import { countOfFeedbacks } from '@/common/apis/services/rate/countOfFeedbacks';
import { satisfactionPercent } from '@/common/apis/services/rate/satisfactionPercent';
import { rate } from '@/common/apis/services/reviews/rate';

type GetRateDetailsData = { slug: string };

export const getRateDetailsData = async ({ slug }: GetRateDetailsData) => {
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
};
