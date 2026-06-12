import { drProfileClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

const extractPageViewCount = (data: Record<string, unknown> | undefined): number | null => {
  if (!data) return null;

  const nested = data.data as Record<string, unknown> | undefined;
  const candidates = [
    data.page_view,
    data.count_of_page_view,
    data.number_of_visits,
    data.views,
    data.view,
    nested?.page_view,
    nested?.count_of_page_view,
    nested?.number_of_visits,
  ];

  for (const value of candidates) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  }

  return null;
};

export const getDoctorPageView = async (slug: string) => {
  const { data } = await drProfileClient.get(`/api/doctors/${encodeURIComponent(slug)}/page-view`, {
    timeout: 5000,
  });
  return extractPageViewCount(data as Record<string, unknown>);
};

export const useDoctorPageView = (slug?: string) =>
  useQuery(['doctorHome', 'pageView', slug], () => getDoctorPageView(slug!), {
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
