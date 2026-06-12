import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { sendDoctorHomeEvent } from '../utils/analytics';

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
      className={classNames(
        'rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5',
        className,
      )}
      onClick={() => sendDoctorHomeEvent(userId, 'notification_click', { count: notifications.length })}
    >
      <p className="text-xs font-bold text-amber-900">
        {notifications.length > 1
          ? `${notifications.length} اعلان جدید`
          : first.title ?? 'اعلان جدید'}
      </p>
      {first.description && (
        <p className="mt-0.5 line-clamp-1 text-xs text-amber-800">{first.description}</p>
      )}
    </div>
  );
};
