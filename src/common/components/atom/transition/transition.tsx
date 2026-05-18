import { HTMLAttributes, ReactNode, useMemo } from 'react';
import { animated, useTransition } from 'react-spring';

interface TranstionProps extends HTMLAttributes<HTMLDivElement> {
  match: boolean;
  children: ReactNode;
  as?: 'div' | 'li' | 'ul' | 'span';
  animation?: 'bottom' | 'left' | 'right' | 'fade';
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  springConfig?: Record<string, any>;
}

export const Transition = (props: TranstionProps) => {
  const { match, children, as = 'div', animation = 'fade', duration = 200, delay = 0, easing, springConfig, ...rest } = props;
  const animationConfig = {
    bottom: {
      leave: { opacity: 0, y: 10 },
      enter: { opacity: 1, y: 0, delay: delay },
      from: { opacity: 0, y: 10 },
    },
    left: {
      leave: { opacity: 0, x: 100 },
      enter: { opacity: 1, x: 0, delay: delay },
      from: { opacity: 0, x: 100 },
    },
    right: {
      leave: { opacity: 0, x: -100 },
      enter: { opacity: 1, x: 0, delay: delay },
      from: { opacity: 0, x: -100 },
    },
    fade: {
      leave: { opacity: 0 },
      enter: { opacity: 1, delay: delay },
      from: { opacity: 0 },
    },
  };

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const transition = useTransition(match, {
    ...animationConfig[animation],
    config: {
      duration: prefersReducedMotion ? 0 : duration,
      ...(easing ? { easing } : {}),
      ...(springConfig || {}),
    },
    immediate: prefersReducedMotion,
  });

  const Component = animated[as] as any;

  return transition(
    (style, isShow) =>
      isShow && (
        <Component style={style} {...rest}>
          {children}
        </Component>
      ),
  );
};

export default Transition;
