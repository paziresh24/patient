import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { normalizeHomePathname } from '@/common/utils/doctorHomePaths';
import {
  getDoctorViewTargetPath,
  modeFromPath,
  normalizeDoctorHomePath,
} from '../hooks/useDoctorViewUrlSync';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { type DoctorViewMode, useDoctorViewModeStore } from '../store/viewMode';
import { useSpaPatientViewStore } from '../utils/spaPatientView';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { DoctorViewSwitcherChrome } from './doctorViewSwitcherChrome';

type Props = {
  className?: string;
  /**
   * `/_/` is doctor-only: show chrome even before Zustand has centers
   * so SSG HTML and first client paint include the switcher (no null hole).
   */
  forceShow?: boolean;
};

export const DoctorViewSwitcher = ({ className, forceShow = false }: Props) => {
  const router = useRouter();
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const deviceCached = useDoctorDeviceCached();
  const setMode = useDoctorViewModeStore(state => state.setMode);
  const markSpaPatientView = useSpaPatientViewStore(state => state.mark);
  const clearSpaPatientView = useSpaPatientViewStore(state => state.clear);

  useEffect(() => {
    void router.prefetch('/');
    void router.prefetch('/_/');
  }, [router]);

  const isDoctor = hasDoctorIdentity(user, deviceCached);
  // Keep chrome visible across / ↔ /_/ even when centers are briefly missing after remount.
  if (!forceShow && !isDoctor && !deviceCached) return null;

  const activeMode = modeFromPath(router.pathname) ?? 'doctor';
  const interactive = isDoctor || deviceCached;

  return (
    <DoctorViewSwitcherChrome
      className={className}
      activeMode={activeMode}
      onSelect={
        interactive
          ? (optionId: DoctorViewMode) => {
              if (optionId === activeMode) return;

              const target = getDoctorViewTargetPath(optionId, router.pathname);
              const currentPath = normalizeHomePathname(router.pathname);
              const normalizedTarget = normalizeHomePathname(target);

              flushSync(() => {
                setMode(optionId);
                if (optionId === 'patient') {
                  markSpaPatientView();
                } else {
                  clearSpaPatientView();
                }
              });

              sendDoctorHomeEvent(userId, 'view_mode_switch', { mode: optionId });
              if (
                currentPath === normalizedTarget ||
                normalizeDoctorHomePath(router.pathname) === target
              ) {
                return;
              }
              void router.push(target);
            }
          : undefined
      }
    />
  );
};
