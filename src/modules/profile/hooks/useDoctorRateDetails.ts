import { useQuery } from '@tanstack/react-query';
import { getRateDetailsData, mapRateDetailsToCardRate } from '@/modules/profile/functions/getRateDetailsData';

export { doctorSlugFromSearchHit } from '@/modules/profile/utils/doctorSlugFromSearchHit';

export const useDoctorRateDetails = (slug?: string) =>
  useQuery(['raviDoctorRate', slug], () => getRateDetailsData({ slug: slug! }), {
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

/** Satisfaction % + review count for SearchCard — same Ravi doctor-rate API as the profile. */
export const useRaviCardRate = (slug?: string) => {
  const query = useDoctorRateDetails(slug);
  return mapRateDetailsToCardRate(query.data);
};
