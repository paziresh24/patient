import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { DoctorHomeFeed } from './components/doctorHomeFeed';
import { useDoctorHomeFeed } from './hooks/useDoctorHomeFeed';

export interface DoctorHomeOverviewProps {
  className?: string;
}

export const DoctorHomeOverview = ({ className }: DoctorHomeOverviewProps) => {
  const user = useUserInfoStore(state => state.info);
  const { items, isDoctor } = useDoctorHomeFeed(user);

  if (!isDoctor) return null;

  return (
    <div className={classNames('pb-32 pt-1', className)}>
      <div className="mx-auto w-full max-w-lg px-4">
        <DoctorHomeFeed items={items} />
      </div>
    </div>
  );
};
