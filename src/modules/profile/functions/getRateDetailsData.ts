import axios from 'axios';
import { fetchDoctorRate } from '@/common/apis/services/reviews/rateDoctor';

type GetRateDetailsData = { slug: string };

const emptyRateDetails = {
  averageRates: {
    average_quality_of_treatment: null,
    average_doctor_encounter: null,
    average_explanation_of_issue: null,
  },
  hide_rates: false,
  countOfFeedbacks: null as number | null,
};

/** Profile head rate badge — same doctor rate API + comments_count as rate-and-review. */
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
      countOfFeedbacks: data?.comments_count != null ? Number(data.comments_count) : null,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error?.code === 'RATE_NOT_FOUND') {
      return emptyRateDetails;
    }
    throw error;
  }
};
