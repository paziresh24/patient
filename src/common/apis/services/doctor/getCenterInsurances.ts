import { drProfileClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export type CenterInsuranceResponse = {
  id: string;
  name: string;
  params?: {
    require_insurance_number?: number;
    [key: string]: unknown;
  };
};

export const isBookingInsuranceEnabled = (value: unknown): boolean => {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true';
  }
  return false;
};

export const getCenterInsurances = async (centerId: string): Promise<CenterInsuranceResponse[]> => {
  if (!centerId) return [];

  const { data } = await drProfileClient.get<CenterInsuranceResponse[]>(
    `/api/centers/${encodeURIComponent(centerId)}/insurances`,
    { timeout: 5000 },
  );

  return Array.isArray(data) ? data : [];
};

export const useCenterInsurances = (centerId: string | undefined, options?: { enabled?: boolean }) => {
  return useQuery(
    [ServerStateKeysEnum.CenterInsurances, centerId],
    () => getCenterInsurances(centerId!),
    {
      enabled: !!centerId && (options?.enabled ?? true),
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  );
};
