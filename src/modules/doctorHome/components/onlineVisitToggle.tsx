import Skeleton from '@/common/components/atom/skeleton';
import Switch from '@/common/components/atom/switch';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useOnlineVisitServices, useToggleOnlineVisit } from '../apis/onlineVisit';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { SectionCard } from './sectionCard';

interface OnlineVisitToggleProps {
  userCenterId?: string;
  hasOnlineVisitCenter: boolean;
  className?: string;
}

const ACTIVATION_URL = 'https://dr.paziresh24.com/activation/consult/rules';

export const OnlineVisitToggle = ({ userCenterId, hasOnlineVisitCenter, className }: OnlineVisitToggleProps) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const { data, isLoading } = useOnlineVisitServices(userCenterId);
  const toggleMutation = useToggleOnlineVisit();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(!!data?.data?.some(item => item.active_booking));
  }, [data]);

  if (!hasOnlineVisitCenter) {
    return (
      <SectionCard className={className}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-800">ویزیت آنلاین</p>
            <p className="mt-1 text-xs text-slate-500">هنوز ویزیت آنلاین را فعال نکرده‌اید.</p>
          </div>
          <Link
            href={ACTIVATION_URL}
            className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
          >
            فعال‌سازی
          </Link>
        </div>
      </SectionCard>
    );
  }

  const handleToggle = async (checked: boolean) => {
    if (!userCenterId || toggleMutation.isLoading) return;

    setIsActive(checked);
    try {
      await toggleMutation.mutateAsync({
        user_center_id: userCenterId,
        can_booking: checked ? '1' : '0',
      });
      sendDoctorHomeEvent(userId, 'online_visit_toggle', { is_on: checked });
    } catch {
      setIsActive(!checked);
    }
  };

  return (
    <SectionCard className={className}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">ویزیت آنلاین</p>
          {isLoading ? (
            <Skeleton h="0.875rem" w="5rem" rounded="full" className="mt-1" />
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              وضعیت:{' '}
              <span className={classNames('font-semibold', isActive ? 'text-green-600' : 'text-slate-500')}>
                {isActive ? 'فعال' : 'غیرفعال'}
              </span>
            </p>
          )}
        </div>
        <Switch checked={isActive} onChange={e => handleToggle(e.target.checked)} disabled={isLoading || toggleMutation.isLoading} />
      </div>
    </SectionCard>
  );
};
