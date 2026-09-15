import { ReactNode, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import classNames from '@/common/utils/classNames';
import { prefersReducedMotion } from '../utils/a11y';

const HEIGHT_SPRING = { tension: 280, friction: 22, mass: 0.95 };

export const DsCollapsible = ({
  open,
  children,
  className,
  id,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const skipEnterRef = useRef(true);
  const [{ height, opacity }, api] = useSpring(() => ({
    height: 0,
    opacity: open ? 1 : 0,
  }));

  useIsomorphicLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const apply = (immediate = false) => {
      const next = open ? el.scrollHeight : 0;
      if (immediate || prefersReducedMotion()) {
        api.set({ height: next, opacity: open ? 1 : 0 });
        return;
      }
      api.start({
        height: next,
        opacity: open ? 1 : 0,
        config: HEIGHT_SPRING,
      });
    };

    if (skipEnterRef.current) {
      skipEnterRef.current = false;
      apply(true);
    } else {
      apply();
    }

    if (!open) return;
    const ro = new ResizeObserver(() => apply(prefersReducedMotion()));
    ro.observe(el);
    return () => ro.disconnect();
  }, [api, open]);

  return (
    <animated.div
      id={id}
      className={classNames('overflow-hidden', className)}
      style={{ height, opacity }}
    >
      <div ref={innerRef}>{children}</div>
    </animated.div>
  );
};
