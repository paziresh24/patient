import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import { animated, useSpring } from 'react-spring';
import { EyeHiddenIcon, EyeVisibleIcon } from '../components/icons';
import { dsFocusRing, prefersReducedMotion } from '../utils/a11y';
import { ds } from './tokens';

const DRAG_CLICK_THRESHOLD = 8;
const DRAG_ACTIVATION = 6;

const dampenNumber = (value: number, max = 60) => {
  if (value === 0) return 0;
  const sign = value > 0 ? 1 : -1;
  return sign * max * (1 - Math.exp(-Math.abs(value) / max));
};

const VAUL_SPRING = { tension: 300, friction: 26, mass: 1 };

const MaskedInsightValue = ({
  visible,
  value,
  hiddenValue = '••••••',
  className,
}: {
  visible: boolean;
  value: string | number | null | undefined;
  hiddenValue?: string;
  className?: string;
}) => (
  <span
    key={visible ? `visible-${value ?? ''}` : 'hidden'}
    className={classNames('inline-block origin-center', ds.motion.walletSwap, className)}
    aria-hidden={!visible}
  >
    {visible ? value : hiddenValue}
  </span>
);

const ToggleEyeIcon = ({ visible }: { visible: boolean }) => (
  <span key={visible ? 'hide' : 'show'} className={classNames('inline-flex', ds.motion.walletSwap)}>
    {visible ? <EyeHiddenIcon size="xs" /> : <EyeVisibleIcon size="xs" />}
  </span>
);

const InsightVisibilityToggle = ({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    data-insight-toggle
    onClick={event => {
      event.preventDefault();
      event.stopPropagation();
      onToggle();
    }}
    className={classNames(
      'relative z-20 flex shrink-0 items-center justify-center p-0.5 text-slate-400 hover:text-slate-600',
      ds.motion.press,
      dsFocusRing,
    )}
    aria-label={isVisible ? 'پنهان کردن موجودی' : 'نمایش موجودی'}
    aria-pressed={isVisible}
  >
    <ToggleEyeIcon visible={isVisible} />
  </button>
);

export interface DsInsightItem {
  icon: ReactNode;
  title: string;
  description: string;
  value?: string | number | null;
  valueMax?: number;
  valueBarClass?: string;
  hiddenValue?: string;
  tint?: string;
  isLoading?: boolean;
  href?: string;
  onClick?: () => void;
  onPress?: () => void;
  visibilityToggle?: {
    isVisible: boolean;
    onToggle: () => void;
  };
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

const parseInsightNumericValue = (value: string | number): number | null => {
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(num) ? num : null;
};

const BAR_FILL_SPRING = { tension: 70, friction: 16 };

const InsightScaledValue = ({
  value,
  max,
  barClassName,
  onFillComplete,
  compact = false,
}: {
  value: string | number;
  max?: number;
  barClassName?: string;
  onFillComplete?: () => void;
  compact?: boolean;
}) => {
  const fillCompleteRef = useRef(onFillComplete);
  const hasCompletedRef = useRef(false);
  fillCompleteRef.current = onFillComplete;

  const numericValue = parseInsightNumericValue(value);
  const percent =
    max != null && numericValue != null
      ? Math.min(100, Math.max(0, (numericValue / max) * 100))
      : null;
  const fillClass = barClassName ?? ds.progress.fill;

  const [{ width }, api] = useSpring(() => ({ width: 0 }));

  useEffect(() => {
    if (percent == null) return;

    hasCompletedRef.current = false;
    if (prefersReducedMotion()) {
      api.set({ width: percent });
      hasCompletedRef.current = true;
      fillCompleteRef.current?.();
      return;
    }

    api.set({ width: 0 });
    api.start({
      to: { width: percent },
      config: BAR_FILL_SPRING,
      onRest: ({ finished }) => {
        if (!finished || hasCompletedRef.current) return;
        hasCompletedRef.current = true;
        fillCompleteRef.current?.();
      },
    });
  }, [api, percent, value]);

  return (
    <div className={classNames('flex flex-col items-end', compact ? 'gap-1' : 'gap-1.5')}>
      <div className="flex items-baseline leading-none" dir="ltr">
        <span className={classNames(compact ? 'text-base font-bold tabular-nums text-slate-900' : ds.type.insightValue, 'leading-none')}>
          {value}
        </span>
        {max != null && (
          <span className={classNames(compact ? 'text-[10px] font-semibold tabular-nums text-slate-300' : ds.type.caption, 'ms-0.5 font-semibold tabular-nums text-slate-300')}>
            <span className="font-normal text-slate-200">/</span>
            {max.toLocaleString('fa-IR')}
          </span>
        )}
      </div>
      {percent != null && (
        <div
          className={classNames(compact ? 'h-0.5 w-8' : 'h-1 w-11', 'overflow-hidden rounded-full', ds.progress.track)}
          aria-hidden
        >
          <animated.div
            className={classNames('h-full rounded-full', fillClass)}
            style={{ width: width.to(w => `${w}%`) }}
          />
        </div>
      )}
    </div>
  );
};

const InsightCardGlassFlash = () => (
  <span className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl" aria-hidden>
    <span className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-slate-200/15 opacity-95" />
    <span className="absolute -inset-y-7 -left-[62%] w-[82%] animate-insight-glass-sweep bg-gradient-to-r from-transparent via-white to-transparent opacity-100 mix-blend-screen blur-[2px] motion-reduce:animate-none" />
    <span className="absolute -inset-y-5 -left-[50%] w-[52%] animate-insight-glass-sweep bg-gradient-to-r from-transparent via-white/95 to-transparent opacity-85 blur-[1px] motion-reduce:animate-none" />
  </span>
);

const InsightCard = ({
  item,
  fullWidth = false,
  appearance = 'default',
  compact = false,
  shouldIgnorePress,
}: {
  item: DsInsightItem;
  fullWidth?: boolean;
  appearance?: 'default' | 'workstation';
  compact?: boolean;
  shouldIgnorePress?: () => boolean;
}) => {
  const isValueVisible = !item.visibilityToggle || item.visibilityToggle.isVisible;
  const hiddenValue = item.hiddenValue ?? '••••••';
  const displayValue = item.value;
  const isWalletCard = !!item.visibilityToggle;
  const hasScoreBar = item.valueMax != null;
  const [glassFlash, setGlassFlash] = useState(false);
  const glassTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleBarFillComplete = useCallback(() => {
    if (!hasScoreBar || prefersReducedMotion()) return;
    setGlassFlash(true);
    if (glassTimeoutRef.current) clearTimeout(glassTimeoutRef.current);
    glassTimeoutRef.current = setTimeout(() => setGlassFlash(false), 900);
  }, [hasScoreBar]);

  useEffect(() => {
    if (item.isLoading) {
      setGlassFlash(false);
      if (glassTimeoutRef.current) clearTimeout(glassTimeoutRef.current);
    }
  }, [item.isLoading]);

  useEffect(
    () => () => {
      if (glassTimeoutRef.current) clearTimeout(glassTimeoutRef.current);
    },
    [],
  );

  const isWorkstation = appearance === 'workstation' && fullWidth;

  const cardClassName = classNames(
    isWorkstation
      ? classNames(ds.workstation.widgetSm, 'min-h-[8rem]')
      : classNames(ds.radius.card, ds.shadow.sm, ds.surface.card),
    'relative overflow-hidden',
    compact
      ? 'flex w-full items-center gap-2.5 p-2.5'
      : classNames('flex flex-col justify-between', isWorkstation ? 'p-5' : 'p-4'),
    !compact && (isWorkstation ? 'min-h-[8rem]' : 'h-[7rem]'),
    !compact && (fullWidth ? 'w-full' : 'w-[9.25rem]'),
    'transition-[transform,box-shadow] duration-200 ease-out',
    (item.href || item.onPress) && 'cursor-pointer hover:-translate-y-px hover:shadow-md active:scale-[0.98]',
    !isWalletCard && fullWidth && !isWorkstation && !compact && (item.href || item.onPress) && 'hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]',
    !isWalletCard && fullWidth && isWorkstation && (item.href || item.onPress) && 'hover:shadow-[0_12px_36px_rgba(15,23,42,0.1)]',
  );

  const iconBoxClass = classNames(compact ? 'h-7 w-7' : 'h-8 w-8', 'shrink-0', ds.icon.containerTile);
  const iconInnerClass = classNames(ds.icon.color, compact ? '[&>svg]:h-3.5 [&>svg]:w-3.5' : '[&>svg]:h-4 [&>svg]:w-4');

  const getWalletValueClass = (metricCompact: boolean) => {
    const text = isValueVisible ? String(item.value ?? '') : hiddenValue;
    const len = text.replace(/[^\d۰-۹]/g, '').length || text.length;

    if (metricCompact) {
      if (fullWidth) {
        if (len > 12) return 'text-xs font-bold tabular-nums text-slate-900';
        if (len > 9) return 'text-sm font-bold tabular-nums text-slate-900';
        return 'text-base font-bold tabular-nums text-slate-900';
      }
      if (len > 10) return 'text-[10px] font-bold tabular-nums text-slate-900';
      if (len > 8) return 'text-xs font-bold tabular-nums text-slate-900';
      if (len > 6) return 'text-sm font-bold tabular-nums text-slate-900';
      return 'text-base font-bold tabular-nums text-slate-900';
    }

    if (fullWidth) {
      if (len > 12) return 'text-sm font-bold tabular-nums text-slate-900';
      if (len > 9) return 'text-base font-bold tabular-nums text-slate-900';
      return ds.type.insightValue;
    }

    if (len > 11) return 'text-[11px] font-bold tabular-nums text-slate-900';
    if (len > 9) return 'text-xs font-bold tabular-nums text-slate-900';
    if (len > 7) return 'text-sm font-bold tabular-nums text-slate-900';
    if (len > 5) return 'text-base font-bold tabular-nums text-slate-900';
    return 'text-lg font-bold tabular-nums text-slate-900';
  };

  const renderMetricValue = (metricCompact = false) => {
    if (item.isLoading) {
      return metricCompact ? (
        <Skeleton h="1rem" w="2.25rem" rounded="md" />
      ) : (
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton h="1.5rem" w="2.75rem" rounded="md" />
          {item.valueMax != null ? <Skeleton h="0.25rem" w="2.75rem" rounded="full" /> : null}
        </div>
      );
    }

    if (displayValue == null) return null;

    if (item.valueMax != null) {
      return (
        <InsightScaledValue
          value={displayValue}
          max={item.valueMax}
          barClassName={item.valueBarClass}
          onFillComplete={handleBarFillComplete}
          compact={metricCompact}
        />
      );
    }

    if (isWalletCard) {
      return (
        <span className={classNames(getWalletValueClass(metricCompact), 'block w-full leading-tight tabular-nums')}>
          <MaskedInsightValue visible={isValueVisible} value={item.value} hiddenValue={hiddenValue} />
        </span>
      );
    }

    return (
      <span
        className={classNames(
          metricCompact ? 'text-base font-bold tabular-nums leading-none text-slate-900' : ds.type.insightValue,
          'leading-none tabular-nums',
        )}
      >
        {displayValue}
      </span>
    );
  };

  const handleCardPress = useCallback(() => {
    if (shouldIgnorePress?.()) return;
    item.onPress?.();
    item.onClick?.();
  }, [item, shouldIgnorePress]);

  const handleWalletCardClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest('[data-insight-toggle]')) return;
      if (!item.onPress) return;
      handleCardPress();
    },
    [handleCardPress, item.onPress],
  );

  const handleWalletCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!item.onPress || (event.key !== 'Enter' && event.key !== ' ')) return;
      if ((event.target as HTMLElement).closest('[data-insight-toggle]')) return;
      event.preventDefault();
      handleCardPress();
    },
    [handleCardPress, item.onPress],
  );

  const walletToggle =
    isWalletCard && item.visibilityToggle ? (
      <InsightVisibilityToggle
        isVisible={item.visibilityToggle.isVisible}
        onToggle={item.visibilityToggle.onToggle}
      />
    ) : null;

  const walletFooter = (
    <div className="min-w-0 text-right">
      <div className="mb-1 text-end leading-tight" dir="ltr">
        {item.isLoading ? (
          <Skeleton h="1.5rem" w="2.75rem" rounded="md" className="ms-auto" />
        ) : (
          renderMetricValue(compact)
        )}
      </div>
      <p className={classNames(ds.type.insightTitle, 'truncate')}>{item.title}</p>
    </div>
  );

  const insightFooter = (
    <div className="min-w-0 text-right">
      <p className={classNames(ds.type.insightTitle, 'truncate')}>{item.title}</p>
      {item.isLoading ? (
        <Skeleton h={compact ? '0.5rem' : '0.625rem'} w="75%" rounded="md" className={compact ? 'mt-1' : 'mt-1.5'} />
      ) : (
        item.description && (
          <p
            className={classNames(
              compact ? ds.type.captionSm : ds.type.caption,
              compact ? 'mt-0.5 truncate' : 'mt-1 truncate',
            )}
          >
            {item.description}
          </p>
        )
      )}
    </div>
  );

  const walletTopRow = (
    <div className="flex items-start justify-between gap-1.5">
      <div className={iconBoxClass}>
        <span className={iconInnerClass}>{item.icon}</span>
      </div>
    </div>
  );

  const insightTopRow = (
    <div className="flex items-start justify-between gap-1.5">
      <div className={iconBoxClass}>
        <span className={iconInnerClass}>{item.icon}</span>
      </div>
      <div className="flex min-w-0 flex-col items-end">{renderMetricValue(compact)}</div>
    </div>
  );

  const walletInteractiveProps =
    isWalletCard && item.onPress
      ? {
          onClick: handleWalletCardClick,
          onKeyDown: handleWalletCardKeyDown,
          role: 'button' as const,
          tabIndex: 0,
        }
      : {};

  if (compact) {
    if (isWalletCard) {
      return (
        <div
          className={classNames(cardClassName, item.onPress && 'cursor-pointer')}
          {...walletInteractiveProps}
        >
          <div className={iconBoxClass}>
            <span className={iconInnerClass}>{item.icon}</span>
          </div>
          <p className={classNames(ds.type.insightTitle, 'min-w-0 flex-1 truncate text-right')}>{item.title}</p>
          {item.isLoading ? (
            <Skeleton h="1rem" w="4.5rem" rounded="md" />
          ) : (
            <div className="flex shrink-0 items-center gap-1.5">
              {walletToggle}
              <div className="text-end leading-tight" dir="ltr">
                {renderMetricValue(true)}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={cardClassName}>
        <div className={iconBoxClass}>
          <span className={iconInnerClass}>{item.icon}</span>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <p className={classNames(ds.type.insightTitle, 'truncate')}>{item.title}</p>
          {item.isLoading ? (
            <Skeleton h="0.5rem" w="60%" rounded="md" className="mt-1" />
          ) : (
            item.description && <p className={classNames(ds.type.captionSm, 'mt-0.5 truncate')}>{item.description}</p>
          )}
        </div>
        <div className="shrink-0">{renderMetricValue(true)}</div>
      </div>
    );
  }

  if (isWalletCard) {
    return (
      <div
        className={classNames(cardClassName, 'relative', item.onPress && 'cursor-pointer')}
        {...walletInteractiveProps}
      >
        {walletToggle ? <div className="absolute top-3 left-3 z-20">{walletToggle}</div> : null}
        {walletTopRow}
        {walletFooter}
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      {glassFlash ? <InsightCardGlassFlash /> : null}
      {insightTopRow}
      {insightFooter}
    </div>
  );
};


export const DsInsightCarousel = ({
  items,
  className,
  header,
  footer,
  variant = 'responsive',
  appearance = 'default',
}: {
  items: DsInsightItem[];
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  /** responsive: کاروسل موبایل + گرید دسکتاپ · grid: فقط گرید · stack: ستون عمودی · carousel: فقط کاروسل */
  variant?: 'responsive' | 'grid' | 'stack' | 'carousel';
  appearance?: 'default' | 'workstation';
}) => {
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

  useIsomorphicLayoutEffect(() => {
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
  const hasBandPadding = !!(header || footer);

  const renderInsightItem = (item: DsInsightItem, index: number, fullWidth = false, compact = false) => {
    const card = (
      <InsightCard
        item={item}
        fullWidth={fullWidth}
        appearance={appearance}
        compact={compact}
        shouldIgnorePress={!fullWidth ? wasDragged : undefined}
      />
    );

    if (item.onPress && !item.visibilityToggle) {
      return (
        <button
          key={index}
          type="button"
          className={classNames('block text-start', dsFocusRing, fullWidth && 'w-full')}
          draggable={false}
          onClick={() => {
            if (!fullWidth && wasDragged()) return;
            item.onPress!();
            item.onClick?.();
          }}
        >
          {card}
        </button>
      );
    }

    if (item.onPress) {
      return (
        <div key={index} className={fullWidth ? 'w-full shrink-0' : 'shrink-0'}>
          {card}
        </div>
      );
    }

    if (item.href) {
      return (
        <Link
          key={index}
          href={item.href}
          draggable={false}
          className={fullWidth ? 'block w-full' : undefined}
          onClick={event => {
            if (!fullWidth && wasDragged()) {
              event.preventDefault();
              return;
            }
            item.onClick?.();
          }}
        >
          {card}
        </Link>
      );
    }

    return (
      <div key={index} className={fullWidth ? 'w-full' : 'shrink-0'}>
        {card}
      </div>
    );
  };

  const showGrid = variant === 'grid' || variant === 'responsive';
  const showCarousel = variant === 'carousel' || variant === 'responsive';
  const showStack = variant === 'stack';

  return (
    <div className={className}>
      {showStack && (
        <div className="flex flex-col gap-2" role="region" aria-label="آمار عملکرد">
          {items.map((item, index) => renderInsightItem(item, index, true, true))}
        </div>
      )}

      {showGrid && (
        <div className={classNames('grid grid-cols-4 gap-3', variant === 'responsive' && 'hidden md:grid')}>
          {items.map((item, index) => renderInsightItem(item, index, true))}
        </div>
      )}

      {showCarousel && (
      <div
        className={classNames(
          'relative -mx-4 overflow-x-clip',
          ds.surface.page,
          hasBandPadding ? 'pb-3' : '-mb-3',
          variant === 'responsive' && 'md:hidden',
        )}
      >
        {header ? <div className="px-4 pb-2.5 pt-2">{header}</div> : null}
        <div
          ref={viewportRef}
          dir={scrollDir}
          role="region"
          aria-label="آمار عملکرد"
          className={classNames(
            'relative z-[1] overflow-x-auto px-4 pt-0.5',
            hasBandPadding ? 'pb-2.5' : 'pb-5',
            'cursor-grab select-none touch-none no-scroll active:cursor-grabbing',
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <animated.div
            ref={trackRef}
            className="flex w-max gap-2.5 will-change-transform"
            style={{
              x: spring.pull,
            }}
          >
            {items.map((item, index) => (
              <div key={index} className="shrink-0">
                {renderInsightItem(item, index)}
              </div>
            ))}
          </animated.div>
        </div>
        {footer ? <div className="px-4">{footer}</div> : null}
      </div>
      )}
    </div>
  );
};
