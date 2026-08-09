import moment from 'jalali-moment';
import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { TimelineStatus } from '../designSystem';

export const getAppointmentTimelineStatuses = (
  appointments: UpcomingAppointment[],
  selectedDate?: string,
): TimelineStatus[] => {
  const today = moment().format('YYYY-MM-DD');
  const day = selectedDate ?? today;
  const isToday = day === today;

  if (!isToday) {
    const isPastDay = moment(day, 'YYYY-MM-DD').isBefore(moment(), 'day');
    return appointments.map(() => (isPastDay ? 'done' : 'upcoming'));
  }

  const now = Math.floor(Date.now() / 1000);
  const hasTimestamps = appointments.some(a => a.from > 0);

  if (!hasTimestamps) {
    return appointments.map((_, index) => (index === 0 ? 'current' : 'upcoming'));
  }

  const firstFutureIndex = appointments.findIndex(a => a.from >= now);

  if (firstFutureIndex === -1) {
    return appointments.map(() => 'done');
  }

  return appointments.map((_, index) => {
    if (index < firstFutureIndex) return 'done';
    if (index === firstFutureIndex) return 'current';
    return 'upcoming';
  });
};
