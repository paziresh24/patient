import axios from 'axios';
import { fetchDoctorRate } from '@/common/apis/services/reviews/rateDoctor';
import { formatAverageRate, getSatisfactionPercent } from '@/modules/profile/utils/getAverageRate';

type GetRateDetailsData = { slug: string };

/** Same gate as Plasmic RateAndCommentCount on the doctor profile. */
export const PROFILE_VISIBLE_RATE_MIN_COUNT = 5;

export type RateDetails = {
  averageRates: {
    average_quality_of_treatment: string | null;
    average_doctor_encounter: string | null;
    average_explanation_of_issue: string | null;
  };
  hide_rates: boolean;
  countOfFeedbacks: number | null;
};

const emptyRateDetails: RateDetails = {
  averageRates: {
    average_quality_of_treatment: null,
    average_doctor_encounter: null,
    average_explanation_of_issue: null,
  },
  hide_rates: false,
  countOfFeedbacks: null,
};

export const mapRateDetailsToCardRate = (
  details?: RateDetails | null,
): { count: number; satisfaction: number; text: string } | undefined => {
  if (!details || details.hide_rates) return undefined;
  const count = details.countOfFeedbacks ?? 0;
  if (count < PROFILE_VISIBLE_RATE_MIN_COUNT) return undefined;
  const score = formatAverageRate(details.averageRates);
  const satisfaction = getSatisfactionPercent(details.averageRates);
  if (!score || satisfaction == null) return undefined;
  return { count, satisfaction, text: `${score} از ۵` };
};

/** Profile head/SEO rate count — same doctor rate API + count_rates as rate-and-review. */
export const getRateDetailsData = async ({ slug }: GetRateDetailsData) => {
  try {
    const data = await fetchDoctorRate(slug);

    const toFixedRate = (value: unknown) => {
      const num = Number(value);
      return Number.isFinite(num) ? num.toFixed(1) : null;
    };

    return {
      averageRates: {
        average_quality_of_treatment: toFixedRate(data?.quality_of_treatment),
        average_doctor_encounter: toFixedRate(data?.doctor_encounter),
        average_explanation_of_issue: toFixedRate(data?.explanation_of_issue),
      },
      hide_rates: Boolean(data?.hide_rates ?? data?.hide),
      countOfFeedbacks: data?.count_rates != null ? Number(data.count_rates) : null,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error?.code === 'RATE_NOT_FOUND') {
      return emptyRateDetails;
    }
    throw error;
  }
};
