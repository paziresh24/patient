import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useDoctorHomeAppointments } from '../hooks/useDoctorHomeAppointments';
import { AppointmentsFeedItem } from './feedItem';

interface FeedAppointmentsSectionProps {
  scheduleExpanded?: boolean;
  widgetShell?: boolean;
  embedCenterStrip?: boolean;
  nested?: boolean;
}

export const FeedAppointmentsSection = ({
  scheduleExpanded = false,
  widgetShell = false,
  embedCenterStrip = false,
  nested = false,
}: FeedAppointmentsSectionProps) => {
  const user = useUserInfoStore(state => state.info);
  const appointments = useDoctorHomeAppointments(user);

  return (
    <AppointmentsFeedItem
      data={{
        items: appointments.items,
        todayCount: appointments.todayCount,
        isTodayCountLoading: appointments.isTodayCountLoading,
        isAppointmentsLoading: appointments.isAppointmentsInitialLoading,
        isAppointmentsFetching: appointments.isAppointmentsFetching,
      }}
      scheduleExpanded={scheduleExpanded}
      widgetShell={widgetShell}
      embedCenterStrip={embedCenterStrip}
      nested={nested}
    />
  );
};
