import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useDoctorHomeNotifications } from '../hooks/useDoctorHomeNotifications';
import { NotificationsSection } from './notificationsSection';

interface FeedAlertsSectionProps {
  widgetShell?: boolean;
}

export const FeedAlertsSection = ({ widgetShell = false }: FeedAlertsSectionProps) => {
  const user = useUserInfoStore(state => state.info);
  const { items } = useDoctorHomeNotifications(user);

  if (items.length === 0) return null;

  return <NotificationsSection items={items} widgetShell={widgetShell} />;
};
