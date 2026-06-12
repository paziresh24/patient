import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { ds } from './tokens';

const DRAG_CLICK_THRESHOLD = 8;
const DRAG_ACTIVATION = 6;

const dampenNumber = (value: number, max = 60) => {
  if (value === 0) return 0;
  const sign = value > 0 ? 1 : -1;
  return sign * max * (1 - Math.exp(-Math.abs(value) / max));
};

const VAUL_SPRING = { tension: 300, friction: 26, mass: 1 };

export interface DsInsightItem {
  icon: ReactNode;
  title: string;
  description: string;
  value?: string | number | null;
  tint?: string;
  isLoading?: boolean;
  href?: string;
  onClick?: () => void;
  onPress?: () => void;
}

const isRtlElement = (el: HTMLElement) => getComputedStyle(el).direction === 'rtl';

/** Normalized scroll — works across Chrome / Firefox RTL quirks */
const getScrollMetrics = (el: HTMLElement) => {
  const max = Math.max(0, el.scrollWidth - el.clientWidth);
  if (max === 0) return { pos: 0, max, atStart: true, atEnd: true };

  const rtl = isRtlElement(el);
  let pos = el.scrollLeft;

  if (rtl) {
    pos = Math.abs(pos);
  }

  pos = Math.max(0, Math.min(max, pos));

  return {
    pos,
    max,
    atStart: pos <= 2,
    atEnd: pos >= max - 2,
  };
};

const InsightCard = ({ item }: { item: DsInsightItem }) => (
  <div
    className={classNames(
      ds.radius.card,
      ds.shadow.card,
      'flex h-[8.75rem] w-[10.75rem] flex-col justify-between border border-slate-100/90 bg-white p-4',
      'transition-[box-shadow] duration-200 ease-out',
      item.href && 'hover:shadow-lg',
    )}
  >
    <div className="flex items-center justify-between gap-2">
      <div
        className={classNames(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          item.tint ?? ds.surface.primarySoft,
        )}
      >
        <span className="text-primary">{item.icon}</span>
      </div>
      {item.isLoading ? (
        <Skeleton h="1.75rem" w="3rem" rounded="md" />
      ) : (
        item.value != null && (
          <span className="text-2xl font-bold tabular-nums leading-none text-slate-900">{item.value}</span>
        )
      )}
    </div>
    <div>
      <p className={ds.type.cardTitle}>{item.title}</p>
      {item.isLoading ? (
        <Skeleton h="0.75rem" w="75%" rounded="md" className="mt-2" />
      ) : (
        <p className={classNames(ds.type.caption, 'mt-1 line-clamp-2')}>{item.description}</p>
      )}
    </div>
  </div>
);


export const DsInsightCarousel = ({ items, className }: { items: DsInsightItem[]; className?: string }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pullRawRef = useRef(0);
  const [scrollDir, setScrollDir] = useState<'rtl' | 'ltr'>('rtl');
  const pointerRef = useRef({
    active: false,
    dragging: false,
    pointerId: -1,
    lastX: 0,
    lastTime: 0,
    dragDistance: 0,
    velocity: 0,
  });
  const [spring, api] = useSpring(() => ({ pull: 0 }));

  useLayoutEffect(() => {
    const dir = document.documentElement.getAttribute('dir');
    setScrollDir(dir === 'ltr' ? 'ltr' : 'rtl');
  }, []);

  const applyPull = useCallback(
    (rawPull: number, immediate = true) => {
      pullRawRef.current = rawPull;
      const pull = dampenNumber(rawPull);
      api.start({ pull, immediate });
    },
    [api],
  );

  const releasePull = useCallback(
    (releaseVelocity = 0) => {
      pullRawRef.current = 0;
      api.start({
        pull: 0,
        config: { ...VAUL_SPRING, velocity: releaseVelocity },
      });
    },
    [api],
  );

  const runMomentum = useCallback((velocity: number) => {
    const viewport = viewportRef.current;
    if (!viewport || Math.abs(velocity) < 0.35) return;

    let v = velocity;
    let frameId = 0;

    const step = () => {
      if (Math.abs(v) < 0.08) return;
      viewport.scrollBy({ left: -v * 14 });
      v *= 0.9;
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollLeft = 0;

    let cancelMomentum: (() => void) | undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      cancelMomentum?.();
      api.stop();
      pointerRef.current = {
        active: true,
        dragging: false,
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastTime: performance.now(),
        dragDistance: 0,
        velocity: 0,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = pointerRef.current;
      if (!state.active || state.pointerId !== event.pointerId) return;

      const now = performance.now();
      const dx = event.clientX - state.lastX;
      const dt = Math.max(now - state.lastTime, 1);
      state.lastX = event.clientX;
      state.lastTime = now;
      state.dragDistance += Math.abs(dx);
      state.velocity = dx / dt;

      if (!state.dragging) {
        if (state.dragDistance < DRAG_ACTIVATION) return;
        state.dragging = true;
        viewport.setPointerCapture(event.pointerId);
      }

      event.preventDefault();

      const metricsBefore = getScrollMetrics(viewport);

      // RTL: swipe-right → toward end, swipe-left → toward start
      // alreadyPulling* tracks which edge we're currently rubber-banding
      const alreadyPullingStart = pullRawRef.current < -0.5;
      const alreadyPullingEnd = pullRawRef.current > 0.5;
      const atEdgeStart = metricsBefore.atStart && dx < 0;
      const atEdgeEnd = metricsBefore.atEnd && dx > 0;

      let didScroll = false;
      if (!alreadyPullingStart && !alreadyPullingEnd && !atEdgeStart && !atEdgeEnd) {
        const scrollBefore = viewport.scrollLeft;
        viewport.scrollBy({ left: -dx });
        const consumed = viewport.scrollLeft - scrollBefore;
        didScroll = Math.abs(consumed) > 0.5;
      }

      const metricsAfter = getScrollMetrics(viewport);

      const pullingPastStart = (metricsBefore.atStart || metricsAfter.atStart) && (dx < 0 || pullRawRef.current < 0);
      const pullingPastEnd = (metricsBefore.atEnd || metricsAfter.atEnd) && (dx > 0 || pullRawRef.current > 0);

      if (pullingPastStart) {
        const nextRaw = pullRawRef.current + (didScroll && dx > 0 ? 0 : dx);
        applyPull(Math.abs(nextRaw) < 0.5 ? 0 : nextRaw, true);
        return;
      }

      if (pullingPastEnd) {
        const nextRaw = pullRawRef.current + (didScroll && dx < 0 ? 0 : dx);
        applyPull(Math.abs(nextRaw) < 0.5 ? 0 : nextRaw, true);
        return;
      }

      if (Math.abs(pullRawRef.current) > 0.5) {
        applyPull(0, true);
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      const state = pointerRef.current;
      if (!state.active || state.pointerId !== event.pointerId) return;

      if (state.dragging && viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }

      const velocity = state.dragging ? state.velocity : 0;
      const hadPull = Math.abs(pullRawRef.current) > 0.5;
      state.active = false;
      state.dragging = false;
      state.pointerId = -1;

      if (hadPull) {
        releasePull(velocity * 8);
      } else {
        releasePull(0);
        cancelMomentum = runMomentum(velocity);
      }
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove, { passive: false });
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);

    return () => {
      cancelMomentum?.();
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('pointercancel', onPointerUp);
    };
  }, [api, applyPull, releasePull, runMomentum, scrollDir]);

  const wasDragged = () => pointerRef.current.dragDistance > DRAG_CLICK_THRESHOLD;

  return (
    <div className={className}>
      <div className="relative -mx-4 -mb-6 overflow-x-clip bg-[#F2F3F5]">
        <div
          ref={viewportRef}
          dir={scrollDir}
          className={classNames(
            'relative z-[1] overflow-x-auto px-4 pb-8 pt-0.5',
            'cursor-grab select-none touch-none no-scroll active:cursor-grabbing',
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <animated.div
            ref={trackRef}
            className="flex w-max gap-3 will-change-transform"
            style={{
              x: spring.pull,
            }}
          >
            {items.map((item, index) => (
              <div key={index} className="shrink-0">
                {item.onPress ? (
                  <button
                    type="button"
                    className="block text-start"
                    draggable={false}
                    onClick={() => {
                      if (wasDragged()) return;
                      item.onPress!();
                      item.onClick?.();
                    }}
                  >
                    <InsightCard item={item} />
                  </button>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    draggable={false}
                    onClick={event => {
                      if (wasDragged()) {
                        event.preventDefault();
                        return;
                      }
                      item.onClick?.();
                    }}
                  >
                    <InsightCard item={item} />
                  </Link>
                ) : (
                  <InsightCard item={item} />
                )}
              </div>
            ))}
          </animated.div>
        </div>
      </div>
    </div>
  );
};
