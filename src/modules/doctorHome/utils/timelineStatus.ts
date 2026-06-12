import { UpcomingAppointment } from '../apis/upcomingAppointments';
import { TimelineStatus } from '../designSystem';

export const getAppointmentTimelineStatuses = (appointments: UpcomingAppointment[]): TimelineStatus[] => {
  const now = Math.floor(Date.now() / 1000);
  const hasTimestamps = appointments.some(a => a.from > 0);

  if (!hasTimestamps) {
    return appointments.map((_, index) => (index === 0 ? 'current' : 'upcoming'));
  }

  const firstFutureIndex = appointments.findIndex(a => a.from >= now);

  if (firstFutureIndex === -1) {
    return appointments.map((_, index) =>
      index === appointments.length - 1 ? 'current' : 'done',
    );
  }

  return appointments.map((appointment, index) => {
    if (index < firstFutureIndex) return 'done';
    if (index === firstFutureIndex) return 'current';
    return 'upcoming';
  });
};
