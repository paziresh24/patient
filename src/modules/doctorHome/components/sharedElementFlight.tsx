import ClientOnlyPortal from '@/common/components/layouts/clientOnlyPortal';
import { useEffect, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { prefersReducedMotion } from '../utils/a11y';
import {
  desktopSheetHeaderTarget,
  mobileSheetHeaderTarget,
  type OriginRect,
} from '../utils/sharedElement';

const FLIP_SPRING = { tension: 280, friction: 26, mass: 0.9 };
const FADE_MS = 160;

export const SharedElementFlight = ({
  active,
  closing,
  origin,
  isDesktop,
  fullHeight,
  onSettled,
}: {
  active: boolean;
  closing: boolean;
  origin: OriginRect | null;
  isDesktop: boolean;
  fullHeight?: boolean;
  onSettled?: () => void;
}) => {
  const settledRef = useRef(false);
  const originRef = useRef(origin);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;
  if (origin) originRef.current = origin;

  const from = originRef.current;
  const [{ left, top, width, height, opacity, radius }, api] = useSpring(() => ({
    left: from?.x ?? 0,
    top: from?.y ?? 0,
    width: from?.width ?? 0,
    height: from?.height ?? 0,
    opacity: 0,
    radius: 16,
  }));

  useEffect(() => {
    const start = originRef.current;
    if (!active || !start) return;
    if (prefersReducedMotion()) {
      onSettledRef.current?.();
      return;
    }

    settledRef.current = false;
    const target = isDesktop ? desktopSheetHeaderTarget(!!fullHeight) : mobileSheetHeaderTarget();
    const to = closing ? start : target;

    api.set({
      left: closing ? target.x : start.x,
      top: closing ? target.y : start.y,
      width: closing ? target.width : start.width,
      height: closing ? target.height : start.height,
      opacity: 1,
      radius: closing ? 24 : 16,
    });

    api.start({
      left: to.x,
      top: to.y,
      width: to.width,
      height: to.height,
      radius: closing ? 16 : 24,
      opacity: closing ? 0 : 1,
      config: FLIP_SPRING,
      onRest: ({ finished }) => {
        if (!finished || settledRef.current) return;
        settledRef.current = true;
        if (!closing) {
          api.start({
            opacity: 0,
            config: { duration: FADE_MS },
            onRest: () => onSettledRef.current?.(),
          });
          return;
        }
        onSettledRef.current?.();
      },
    });
  }, [active, api, closing, fullHeight, isDesktop]);

  if (!active || !from || prefersReducedMotion()) return null;

  return (
    <ClientOnlyPortal selector="body">
      <animated.div
        aria-hidden
        className="pointer-events-none fixed z-[960] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80"
        style={{
          left,
          top,
          width,
          height,
          opacity,
          borderRadius: radius.to(r => `${r}px`),
        }}
      />
    </ClientOnlyPortal>
  );
};
