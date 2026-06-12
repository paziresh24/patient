import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

export interface HolidayEvent {
  description: string;
  additional_description: string;
  is_holiday: boolean;
}

export interface Holiday {
  date: string;
  events: HolidayEvent[];
  is_holiday: boolean;
}

const getHolidays = async (startDate: string, endDate: string): Promise<Holiday[]> => {
  const { data } = await apiGatewayClient.get('/v1/holidays', {
    params: { start_date: startDate, end_date: endDate },
  });
  const items: Array<Record<string, unknown>> = Array.isArray(data) ? data : (data?.data ?? []);
  return items
    .filter(h => h.date)
    .map(h => ({
      date: String(h.date),
      is_holiday: Boolean(h.is_holiday),
      events: (Array.isArray(h.events) ? h.events : []).map((e: Record<string, unknown>) => ({
        description: String(e.description ?? ''),
        additional_description: String(e.additional_description ?? ''),
        is_holiday: Boolean(e.is_holiday),
      })),
    }));
};

export const HOLIDAY_YEAR_START = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);
export const HOLIDAY_YEAR_END = new Date(new Date().getFullYear(), 11, 31).toISOString().slice(0, 10);

export const useHolidays = (startDate: string, endDate: string) =>
  useQuery(['holidays', startDate, endDate], () => getHolidays(startDate, endDate), {
    staleTime: 24 * 60 * 60 * 1000,
  });
