import classNames from '@/common/utils/classNames';
import { DoctorHomeOverview } from '../doctorHomeOverview';
import { ds } from '../designSystem';

export const DoctorLauncherContent = () => {
  return (
    <div className={classNames('min-h-screen', ds.surface.page)}>
      <DoctorHomeOverview />
    </div>
  );
};
