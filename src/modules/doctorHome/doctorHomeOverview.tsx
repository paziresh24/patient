import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { DoctorHomeFeed } from './components/doctorHomeFeed';
import { ds } from './designSystem';
import { useDoctorHomeContext } from './hooks/useDoctorHomeContext';
import { useDoctorHomeStats } from './hooks/useDoctorHomeStats';

export interface DoctorHomeOverviewProps {
  className?: string;
}

export const DoctorHomeOverview = ({ className }: DoctorHomeOverviewProps) => {
  const user = useUserInfoStore(state => state.info);
  const { isDoctor } = useDoctorHomeContext(user);
  // Subscribe at page level so rate/doctor + pageView always run (not only when insight UI mounts).
  useDoctorHomeStats(user);

  if (!isDoctor) return null;

  return (
    <div className={classNames(ds.layout.pagePadding, className)}>
      <div className={ds.layout.pageShell}>
        <DoctorHomeFeed />
      </div>
    </div>
  );
};
