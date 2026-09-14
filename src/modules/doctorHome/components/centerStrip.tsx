import classNames from '@/common/utils/classNames';
import { Fragment, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { ds } from '../designSystem';
import { dsFocusRing, prefersReducedMotion } from '../utils/a11y';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { getDoctorCenterOptions } from '../utils/centers';

const PILL_SPRING = { tension: 320, friction: 28, mass: 0.9 };

export const CenterStrip = ({ className }: { className?: string }) => {
  const user = useUserInfoStore(state => state.info);
  const options = getDoctorCenterOptions(user);
  const selectedCenterId = useSelectedCenterStore(state => state.selectedCenterId);
  const setSelectedCenterId = useSelectedCenterStore(state => state.setSelectedCenterId);
  const trackRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [{ x, width }, api] = useSpring(() => ({ x: 0, width: 0 }));
  const firstPillRef = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const key = selectedCenterId ?? 'all';
    const el = btnRefs.current[key];
    if (!el) return;
    const nextX = el.offsetLeft;
    const nextW = el.offsetWidth;
    if (firstPillRef.current || prefersReducedMotion()) {
      firstPillRef.current = false;
      api.set({ x: nextX, width: nextW });
      return;
    }
    api.start({ x: nextX, width: nextW, config: PILL_SPRING });
  }, [api, options, selectedCenterId]);

  if (options.length <= 1) return null;

  return (
    <div className={classNames('-mx-1 overflow-x-auto px-1 no-scroll', className)}>
      <div
        ref={trackRef}
        role="group"
        aria-label="انتخاب مرکز"
        className={classNames('relative flex w-max min-w-full items-center whitespace-nowrap', ds.type.label)}
      >
        <animated.span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary"
          style={{ left: x, width }}
        />
        {options.map((option, index) => {
          const key = option.id ?? 'all';
          const isSelected = selectedCenterId === option.id;

          return (
            <Fragment key={key}>
              {index > 0 && <span className="px-2 text-slate-300 select-none" aria-hidden>•</span>}
              <button
                ref={node => {
                  btnRefs.current[key] = node;
                }}
                type="button"
                onClick={() => setSelectedCenterId(option.id)}
                aria-pressed={isSelected}
                className={classNames(
                  'relative shrink-0 py-1 pb-1.5 transition-colors',
                  dsFocusRing,
                  isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-500',
                )}
              >
                {option.name}
                {option.addressHint && (
                  <span className={classNames('font-normal', isSelected ? ds.type.caption : ds.type.captionMuted)}>
                    {' '}({option.addressHint})
                  </span>
                )}
              </button>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
