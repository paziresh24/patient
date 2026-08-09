import classNames from '@/common/utils/classNames';
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
import { type DoctorViewMode, isDoctorUser, useDoctorViewModeStore } from '../store/viewMode';
import { useSpaPatientViewStore } from '../utils/spaPatientView';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { ds } from '../designSystem/tokens';

const options: { id: DoctorViewMode; label: string }[] = [
  { id: 'doctor', label: 'پزشک' },
  { id: 'patient', label: 'بیمار' },
];

export const DoctorViewSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const setMode = useDoctorViewModeStore(state => state.setMode);
  const markSpaPatientView = useSpaPatientViewStore(state => state.mark);
  const clearSpaPatientView = useSpaPatientViewStore(state => state.clear);

  useEffect(() => {
    void router.prefetch('/');
    void router.prefetch('/_/');
  }, [router]);

  if (!isDoctorUser(user)) return null;

  const activeMode = modeFromPath(router.pathname) ?? 'patient';
  const activeIndex = Math.max(0, options.findIndex(option => option.id === activeMode));
  const viewBackground = activeMode === 'patient' ? 'bg-white' : ds.surface.page;
  const tabWidth = 100 / options.length;

  return (
    <div className={classNames('flex justify-center px-4 pb-1.5 pt-3 md:px-6', viewBackground, className)}>
      <div
        className={classNames('relative inline-flex scale-[0.92] rounded-full p-0.5 md:scale-100', ds.surface.switcherTrack)}
        role="tablist"
        aria-label="انتخاب نمای کاربری"
        dir="rtl"
      >
        <span
          aria-hidden
          className={classNames(
            'pointer-events-none absolute inset-y-0.5 rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,0.1)]',
            ds.motion.pillSlide,
          )}
          style={{
            width: `calc(${tabWidth}% - 2px)`,
            insetInlineStart: `calc(${activeIndex * tabWidth}% + 1px)`,
          }}
        />
        {options.map(option => {
          const isActive = activeMode === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (option.id === activeMode) return;

                const target = getDoctorViewTargetPath(option.id, router.pathname);
                const currentPath = normalizeHomePathname(router.pathname);
                const normalizedTarget = normalizeHomePathname(target);

                // Flush store updates before navigation so mobile redirect
                // sees patient opt-out on the very next render (no bounce).
                flushSync(() => {
                  setMode(option.id);
                  if (option.id === 'patient') {
                    markSpaPatientView();
                  } else {
                    clearSpaPatientView();
                  }
                });

                sendDoctorHomeEvent(userId, 'view_mode_switch', { mode: option.id });
                if (
                  currentPath === normalizedTarget ||
                  normalizeDoctorHomePath(router.pathname) === target
                ) {
                  return;
                }
                void router.push(target);
              }}
              className={classNames(
                'relative z-[1] min-w-[3.75rem] rounded-full px-2.5 py-1',
                ds.motion.color,
                ds.motion.press,
                isActive
                  ? classNames(ds.type.tabActive, 'text-slate-800')
                  : classNames(ds.type.tabInactive, 'text-slate-500 hover:text-slate-700'),
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
