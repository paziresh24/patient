import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect } from 'react';
import { DoctorHomeOverview } from '../doctorHomeOverview';
import { ds } from '../designSystem';
import { useDoctorViewModeStore, isDoctorUser } from '../store/viewMode';
import { DoctorViewSwitcher } from './doctorViewSwitcher';
import { PatientHomeEmbed } from './patientHomeEmbed';

export const DoctorLauncherContent = () => {
  const user = useUserInfoStore(state => state.info);
  const mode = useDoctorViewModeStore(state => state.mode);
  const hydrate = useDoctorViewModeStore(state => state.hydrate);
  const isDoctor = isDoctorUser(user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isDoctor) {
    return (
      <div className={classNames('min-h-screen', ds.surface.page)}>
        <DoctorHomeOverview />
      </div>
    );
  }

  return (
    <div className={classNames('min-h-screen', ds.surface.page)}>
      <DoctorViewSwitcher />
      {mode === 'patient' ? <PatientHomeEmbed /> : <DoctorHomeOverview />}
    </div>
  );
};
