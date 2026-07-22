import { fetchRateSummary } from '@/modules/rate-and-review/api';
import { averageFromBreakdown } from '@/modules/rate-and-review/utils/rating';
import { useQuery } from '@tanstack/react-query';

export interface DoctorRateStats {
  rating: number | null;
  rateCount: number | null;
}

const mapRateSummaryToStats = (summary: Awaited<ReturnType<typeof fetchRateSummary>>): DoctorRateStats => {
  if (!summary || summary.hideRates) {
    return { rating: null, rateCount: null };
  }

  const avg = averageFromBreakdown(summary.items);
  if (!avg) {
    return { rating: null, rateCount: null };
  }

  const rateCount = summary.rateCount;
  return {
    rating: Number(avg.toFixed(1)),
    rateCount: Number.isFinite(rateCount) && rateCount > 0 ? rateCount : null,
  };
};

export const getDoctorRateStats = async (slug: string): Promise<DoctorRateStats> =>
  mapRateSummaryToStats(await fetchRateSummary(slug));

export const useDoctorRateStats = (slug?: string, enabled = true) =>
  useQuery(['doctorHome', 'rateSummary', slug], () => getDoctorRateStats(slug!), {
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
