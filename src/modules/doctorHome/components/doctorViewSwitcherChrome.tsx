import classNames from '@/common/utils/classNames';
import { ds } from '../designSystem/tokens';
import type { DoctorViewMode } from '../store/viewMode';

const OPTIONS: { id: DoctorViewMode; label: string }[] = [
  { id: 'doctor', label: 'پزشک' },
  { id: 'patient', label: 'بیمار' },
];

type Props = {
  className?: string;
  activeMode?: DoctorViewMode;
  /** When set, tabs are interactive; omit for SSG/presentational chrome. */
  onSelect?: (mode: DoctorViewMode) => void;
};

/** Presentational پزشک/بیمار chrome — safe for SSG (no user store). */
export function DoctorViewSwitcherChrome({ className, activeMode = 'doctor', onSelect }: Props) {
  const activeIndex = Math.max(0, OPTIONS.findIndex(option => option.id === activeMode));
  const viewBackground = activeMode === 'patient' ? 'bg-white' : ds.surface.page;
  const tabWidth = 100 / OPTIONS.length;

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
        {OPTIONS.map(option => {
          const isActive = option.id === activeMode;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={!onSelect}
              onClick={() => onSelect?.(option.id)}
              className={classNames(
                'relative z-[1] min-w-[3.75rem] rounded-full px-2.5 py-1',
                ds.motion.color,
                ds.motion.press,
                isActive
                  ? classNames(ds.type.tabActive, 'text-slate-800')
                  : classNames(ds.type.tabInactive, 'text-slate-500 hover:text-slate-700'),
                !onSelect && 'pointer-events-none',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
