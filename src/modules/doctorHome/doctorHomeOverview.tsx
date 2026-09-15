import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { DoctorHomeFeed } from './components/doctorHomeFeed';
import { ds } from './designSystem';
import { useDoctorHomeStats } from './hooks/useDoctorHomeStats';

export interface DoctorHomeOverviewProps {
  className?: string;
}

export const DoctorHomeOverview = ({ className }: DoctorHomeOverviewProps) => {
  const user = useUserInfoStore(state => state.info);
  useDoctorHomeStats(user);

  return (
    <div className={classNames(ds.layout.pagePadding, className)}>
      <div className={ds.layout.pageShell}>
        <DoctorHomeFeed />
      </div>
    </div>
  );
};
