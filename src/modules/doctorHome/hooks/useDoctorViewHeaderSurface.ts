import { useRouter } from 'next/router';
import { ds } from '../designSystem/tokens';
import { modeFromPath } from './useDoctorViewUrlSync';
import { useDoctorViewSwapActive } from './useDoctorViewSwapActive';
import { useIsNewDoctorLauncherLoading } from './useNewDoctorLauncher';

export const DOCTOR_HOME_SURFACE_CLASS = ds.surface.page;

export const useDoctorViewHeaderSurface = () => {
  const router = useRouter();
  const swapActive = useDoctorViewSwapActive();
  const doctorLauncherLoading = useIsNewDoctorLauncherLoading();
  const showSwitcher = swapActive || doctorLauncherLoading;

  return showSwitcher && modeFromPath(router.pathname) === 'doctor';
};
