import { useDoctorViewSwapActive } from '../hooks/useDoctorViewSwapActive';
import { DoctorViewSwitcher } from './doctorViewSwitcher';
import { ds } from '../designSystem/tokens';
import { useRouter } from 'next/router';
import { modeFromPath } from '../hooks/useDoctorViewUrlSync';

/** @deprecated Use page-level switcher + route navigation instead of in-page swapping. */
export const DoctorViewSwap = () => {
  const swapEnabled = useDoctorViewSwapActive();
  const router = useRouter();

  if (!swapEnabled) return null;

  const activeMode = modeFromPath(router.pathname) ?? 'patient';
  const switcherBackground = activeMode === 'patient' ? 'bg-white' : ds.surface.page;

  return (
    <div className={switcherBackground}>
      <DoctorViewSwitcher className="px-0 pb-1 pt-3" />
    </div>
  );
};
