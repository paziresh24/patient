import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { ds } from '../designSystem/tokens';

interface NotificationItem {
  title?: string;
  description?: string;
  sender?: string;
}

interface AlertsBannerProps {
  notifications: NotificationItem[];
  className?: string;
}

export const AlertsBanner = ({ notifications, className }: AlertsBannerProps) => {
  const userId = useUserInfoStore(state => state.info?.id);

  if (!notifications.length) return null;

  const first = notifications[0];

  return (
    <div
      className={classNames(ds.surface.alertBanner, ds.layout.rowPadding, className)}
      onClick={() => sendDoctorHomeEvent(userId, 'notification_click', { count: notifications.length })}
    >
      <p className={ds.type.warningTitle}>
        {notifications.length > 1
          ? `${notifications.length} اعلان جدید`
          : first.title ?? 'اعلان جدید'}
      </p>
      {first.description && (
        <p className={classNames(ds.type.warningBody, 'mt-0.5 line-clamp-1')}>{first.description}</p>
      )}
    </div>
  );
};
