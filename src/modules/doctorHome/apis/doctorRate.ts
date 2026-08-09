import { fetchDoctorRate } from '@/common/apis/services/reviews/rateDoctor';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export interface DoctorRateStats {
  rating: number | null;
  rateCount: number | null;
}

const isRateNotFound = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.data?.error?.code === 'RATE_NOT_FOUND';

const mapDoctorRateToStats = (data: Record<string, unknown>): DoctorRateStats => {
  if (data?.hide_rates || data?.hide) {
    return { rating: null, rateCount: null };
  }

  const avg =
    ((Number(data.quality_of_treatment) || 0) +
      (Number(data.doctor_encounter) || 0) +
      (Number(data.explanation_of_issue) || 0)) /
    3;

  if (!avg) {
    return { rating: null, rateCount: null };
  }

  const rateCount = Number(data.rate_count);
  return {
    rating: Number(avg.toFixed(1)),
    rateCount: Number.isFinite(rateCount) && rateCount > 0 ? rateCount : null,
  };
};

export const getDoctorRateStats = async (slug: string): Promise<DoctorRateStats> => {
  try {
    return mapDoctorRateToStats(await fetchDoctorRate(slug));
  } catch (error) {
    if (isRateNotFound(error)) {
      return { rating: null, rateCount: null };
    }
    throw error;
  }
};

export const useDoctorRateStats = (slug?: string, enabled = true) =>
  useQuery(['doctorHome', 'rateSummary', slug], () => getDoctorRateStats(slug!), {
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
