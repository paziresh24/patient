import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect } from 'react';
import { useDoctorViewModeStore, type DoctorViewMode, isDoctorUser } from '../store/viewMode';
import { sendDoctorHomeEvent } from '../utils/analytics';

const options: { id: DoctorViewMode; label: string }[] = [
  { id: 'doctor', label: 'پزشک' },
  { id: 'patient', label: 'بیمار' },
];

export const DoctorViewSwitcher = ({ className }: { className?: string }) => {
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const mode = useDoctorViewModeStore(state => state.mode);
  const setMode = useDoctorViewModeStore(state => state.setMode);
  const hydrate = useDoctorViewModeStore(state => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isDoctorUser(user)) return null;

  return (
    <div className={classNames('flex justify-center bg-[#F2F3F5] px-4 pb-2 pt-2.5', className)}>
      <div
        className="inline-flex rounded-full border border-slate-200/70 bg-white/70 p-0.5"
        role="tablist"
        aria-label="انتخاب نمای کاربری"
      >
        {options.map(option => {
          const isActive = mode === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (option.id === mode) return;
                setMode(option.id);
                sendDoctorHomeEvent(userId, 'view_mode_switch', { mode: option.id });
              }}
              className={classNames(
                'min-w-[4.25rem] rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                isActive
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500',
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
