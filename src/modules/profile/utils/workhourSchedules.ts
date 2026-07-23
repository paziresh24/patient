import axios from 'axios';

export type WorkhourSchedule = {
  day: string;
  from_date?: string | null;
  to_date?: string | null;
  from_hour: string;
  to_hour: string;
  types?: number[];
};

export type CenterService = {
  id: string;
  service?: {
    id?: string;
    title?: string;
  } | null;
};

const SERVICES_API = 'https://drprofile.paziresh24.com/api/doctors';
const SCHEDULES_API = 'https://drprofile.paziresh24.com/api/doctor-services';

export const WEEK_DAYS = [
  { english: 'saturday', persian: 'شنبه' },
  { english: 'sunday', persian: 'یک‌شنبه' },
  { english: 'monday', persian: 'دوشنبه' },
  { english: 'tuesday', persian: 'سه‌شنبه' },
  { english: 'wednesday', persian: 'چهارشنبه' },
  { english: 'thursday', persian: 'پنج‌شنبه' },
  { english: 'friday', persian: 'جمعه' },
] as const;

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

export function sanitizeCenterServices(data: unknown): CenterService[] {
  if (!Array.isArray(data)) return [];
  return data.filter((service): service is CenterService => !!service?.id && !!service?.service?.title);
}

export async function fetchCenterServices(slug: string, centerId: string): Promise<CenterService[]> {
  const response = await axios.get(`${SERVICES_API}/${encodeURIComponent(slug)}/centers/${centerId}/services`);
  return sanitizeCenterServices(response.data);
}

export async function fetchServiceSchedules(serviceId: string): Promise<WorkhourSchedule[]> {
  try {
    const response = await axios.get(`${SCHEDULES_API}/${encodeURIComponent(serviceId)}/schedules`);
    return sanitizeWorkhourSchedules(response.data);
  } catch {
    return [];
  }
}

export function formatScheduleSlot(item: WorkhourSchedule): string {
  const range = `${item.from_hour.slice(0, 5)} - ${item.to_hour.slice(0, 5)}`;
  if (!item.from_date) return range;
  const from = new Date(item.from_date).toLocaleDateString('fa-IR-u-nu-latn');
  const to = item.to_date ? new Date(item.to_date).toLocaleDateString('fa-IR-u-nu-latn') : '';
  return `(از تاریخ ${from}${to ? ` تا ${to}` : ''}) ${range}`;
}

export function formatDaySchedules(schedules: WorkhourSchedule[], dayEnglish: string): string {
  const slots = schedules.filter(item => item.day === dayEnglish).map(formatScheduleSlot);
  return slots.length ? slots.join('<br/>') : '---';
}

/** Kept for compatibility with older Plasmic wrapper overrides on main. */
export async function reorderServicesBySchedules(data: unknown): Promise<CenterService[]> {
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
