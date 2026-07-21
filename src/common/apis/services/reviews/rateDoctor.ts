import { raviApisClient } from '@/common/apis/client';

/** GET /ravi/v1/rate/doctor/{slug} — shared source for profile head + rate summary. */
export const fetchDoctorRate = async (slug: string): Promise<Record<string, unknown>> => {
  const { data } = await raviApisClient.get<Record<string, unknown>>(
    `/ravi/v1/rate/doctor/${encodeURIComponent(slug)}`,
    { timeout: 12_000 },
  );
  return data ?? {};
};
