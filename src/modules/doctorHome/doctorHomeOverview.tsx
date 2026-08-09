import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { DoctorHomeFeed } from './components/doctorHomeFeed';
import { ds } from './designSystem';
import { useDoctorHomeFeed } from './hooks/useDoctorHomeFeed';

export interface DoctorHomeOverviewProps {
  className?: string;
}

export const DoctorHomeOverview = ({ className }: DoctorHomeOverviewProps) => {
  const user = useUserInfoStore(state => state.info);
  const { items, isDoctor, notificationDateSet } = useDoctorHomeFeed(user);

  if (!isDoctor) return null;

  return (
    <div className={classNames(ds.layout.pagePadding, className)}>
      <div className={ds.layout.pageShell}>
        <DoctorHomeFeed items={items} notificationDateSet={notificationDateSet} />
      </div>
    </div>
  );
};
