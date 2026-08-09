import classNames from '@/common/utils/classNames';
import { DoctorHomeOverview } from '../doctorHomeOverview';
import { ds } from '../designSystem';
import { DoctorHomeAppModalProvider } from '../hooks/useDoctorHomeAppModal';

export const DoctorLauncherContent = () => {
  return (
    <DoctorHomeAppModalProvider>
      <div className={classNames('min-h-screen', ds.surface.page)}>
        <DoctorHomeOverview />
      </div>
    </DoctorHomeAppModalProvider>
  );
};

export default DoctorLauncherContent;
