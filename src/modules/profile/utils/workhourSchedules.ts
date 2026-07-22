import axios from 'axios';

export type WorkhourSchedule = {
  day: string;
  from_date?: string | null;
  to_date?: string | null;
  from_hour: string;
  to_hour: string;
  types?: number[];
};

const SCHEDULES_API_BASE = 'https://drprofile.paziresh24.com/api/doctor-services';

export function isValidWorkhourSchedule(item: unknown): item is WorkhourSchedule {
  if (!item || typeof item !== 'object') return false;
  const schedule = item as WorkhourSchedule;
  return (
    typeof schedule.day === 'string' &&
    typeof schedule.from_hour === 'string' &&
    typeof schedule.to_hour === 'string'
  );
}

export function sanitizeWorkhourSchedules(data: unknown): WorkhourSchedule[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isValidWorkhourSchedule);
}

export function sanitizeCenterServices(data: unknown): any[] {
  if (!Array.isArray(data)) return [];
  return data.filter(service => service?.id && service?.service);
}

export async function fetchServiceSchedules(serviceId: string): Promise<WorkhourSchedule[]> {
  try {
    const response = await axios.get(`${SCHEDULES_API_BASE}/${encodeURIComponent(serviceId)}/schedules`);
    return sanitizeWorkhourSchedules(response.data);
  } catch {
    return [];
  }
}

export async function reorderServicesBySchedules(data: unknown): Promise<any[]> {
  const services = sanitizeCenterServices(data);
  if (services.length <= 1) return services;

  const ranked = await Promise.all(
    services.map(async service => ({
      service,
      schedules: await fetchServiceSchedules(service.id),
    })),
  );

  const withSchedules = ranked.filter(item => item.schedules.length > 0).map(item => item.service);
  const withoutSchedules = ranked.filter(item => item.schedules.length === 0).map(item => item.service);

  return [...withSchedules, ...withoutSchedules];
}
