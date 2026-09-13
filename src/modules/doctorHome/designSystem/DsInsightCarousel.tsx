import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import { animated, useSpring } from 'react-spring';
import { EyeHiddenIcon, EyeVisibleIcon } from '../components/icons';
import { dsFocusRing, prefersReducedMotion } from '../utils/a11y';
import { DsCard } from './DsCard';
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
      'relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600',
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
  /** signed week-over-week percent; omit bar when set */
  trendPercent?: number | null;
  hideBar?: boolean;
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

const InsightTrendChip = ({ percent }: { percent: number }) => {
  const up = percent > 0;
  const flat = percent === 0;
  const label = flat
    ? 'بدون تغییر نسبت به هفته قبل'
    : `${Math.abs(percent).toLocaleString('fa-IR')} درصد ${up ? 'رشد' : 'کاهش'} تعداد نظر نسبت به هفته قبل`;

  return (
    <span
      className={classNames(
        'inline-flex shrink-0 items-center self-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none',
        flat ? 'bg-slate-100 text-slate-500' : up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600',
      )}
      aria-label={label}
      title={label}
    >
      {flat ? '۰٪' : `${up ? '▲' : '▼'}${Math.abs(percent).toLocaleString('fa-IR')}٪`}
    </span>
  );
};

const InsightScaledValue = ({
  value,
  max,
  barClassName,
  onFillComplete,
  compact = false,
  stacked = false,
  showBar = true,
}: {
  value: string | number;
  max?: number;
  barClassName?: string;
  onFillComplete?: () => void;
  compact?: boolean;
  stacked?: boolean;
  showBar?: boolean;
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
    <div className={classNames('flex flex-col', stacked ? 'items-stretch gap-1.5' : compact ? 'items-end gap-1' : 'items-end gap-1.5')}>
      <div className={classNames('flex items-center leading-none', stacked ? 'gap-0.5' : '')} dir={stacked ? undefined : 'ltr'}>
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
      {showBar && percent != null ? (
        <div
          className={classNames(
            compact ? 'h-0.5 w-8' : stacked ? 'h-1 w-full' : 'h-1 w-11',
            'overflow-hidden rounded-full',
            ds.progress.track,
          )}
          aria-hidden
        >
          <animated.div
            className={classNames('h-full rounded-full', fillClass)}
            style={{ width: width.to(w => `${w}%`) }}
          />
        </div>
      ) : null}
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
  grouped = false,
  isLast = false,
  shouldIgnorePress,
}: {
  item: DsInsightItem;
  fullWidth?: boolean;
  appearance?: 'default' | 'workstation';
  compact?: boolean;
  grouped?: boolean;
  isLast?: boolean;
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
    if (!hasScoreBar || item.hideBar || prefersReducedMotion()) return;
    setGlassFlash(true);
    if (glassTimeoutRef.current) clearTimeout(glassTimeoutRef.current);
    glassTimeoutRef.current = setTimeout(() => setGlassFlash(false), 900);
  }, [hasScoreBar, item.hideBar]);

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
  const isWorkstationCompact = appearance === 'workstation' && compact && !grouped;

  const compactRowClassName = classNames(
    'relative flex w-full items-center justify-between gap-3',
    grouped
      ? classNames(
          ds.layout.rowPadding,
          !isLast && 'border-b border-slate-100',
          (item.href || item.onPress) && ds.motion.listRow,
        )
      : classNames(
          isWorkstationCompact
            ? classNames(ds.radius.card, ds.shadow.sm, ds.surface.card, 'min-h-[3.75rem]')
            : classNames(ds.radius.card, ds.shadow.sm, ds.surface.card),
          isWorkstationCompact ? 'p-3.5' : 'p-3',
          (item.href || item.onPress) && 'cursor-pointer hover:-translate-y-px hover:shadow-md active:scale-[0.98]',
        ),
  );

  const cardClassName = classNames(
    grouped && compact
      ? compactRowClassName
      : classNames(
          isWorkstation
            ? classNames(ds.workstation.widgetSm, 'min-h-[8rem]')
            : classNames(ds.radius.card, ds.shadow.sm, ds.surface.card),
          'relative overflow-hidden',
          compact
            ? classNames('flex w-full items-center justify-between', isWorkstationCompact ? 'gap-3 p-3.5' : 'gap-3 p-3')
            : classNames('flex h-full min-h-[7.5rem] flex-col', isWorkstation ? 'gap-3 p-5' : 'gap-2 p-3'),
        ),
    !grouped && 'relative overflow-hidden',
    !compact && (isWorkstation ? 'min-h-[8.5rem]' : 'min-h-[7.5rem]'),
    !compact && (fullWidth ? 'w-full' : 'w-[11.25rem]'),
    !grouped && 'transition-[transform,box-shadow] duration-200 ease-out',
    !grouped &&
      (item.href || item.onPress) &&
      'cursor-pointer hover:-translate-y-px hover:shadow-md active:scale-[0.98]',
    !grouped &&
      !isWalletCard &&
      fullWidth &&
      !isWorkstation &&
      !compact &&
      (item.href || item.onPress) &&
      'hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]',
    !grouped &&
      !isWalletCard &&
      fullWidth &&
      isWorkstation &&
      (item.href || item.onPress) &&
      'hover:shadow-[0_12px_36px_rgba(15,23,42,0.1)]',
  );

  const iconBoxClass = classNames(compact ? 'h-7 w-7' : 'h-7 w-7', 'shrink-0', ds.icon.containerTile);
  const iconInnerClass = classNames(ds.icon.color, '[&>svg]:h-3.5 [&>svg]:w-3.5');

  const renderMetricValue = (metricCompact = false, stacked = false) => {
    if (item.isLoading) {
      return metricCompact ? (
        <Skeleton h="1rem" w="2.25rem" rounded="md" />
      ) : (
        <div className={classNames('flex flex-col', stacked ? 'items-stretch gap-1.5' : 'items-end gap-1.5')}>
          <Skeleton h="1.5rem" w="2.75rem" rounded="md" />
          {item.valueMax != null ? <Skeleton h="0.25rem" w={stacked ? '100%' : '2.75rem'} rounded="full" /> : null}
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
          stacked={stacked}
          showBar={!item.hideBar}
        />
      );
    }

    if (isWalletCard && !isValueVisible) {
      return (
        <span
          className={classNames(
            metricCompact ? 'text-base font-bold tabular-nums leading-none text-slate-900' : ds.type.insightValue,
            'leading-none tracking-[0.18em] tabular-nums',
          )}
        >
          <MaskedInsightValue visible={false} value={item.value} hiddenValue={hiddenValue} />
        </span>
      );
    }

    return (
      <span
        className={classNames(
          metricCompact
            ? 'text-base font-bold tabular-nums leading-tight text-slate-900'
            : isWalletCard
              ? 'whitespace-nowrap text-lg font-bold leading-tight tabular-nums text-slate-900'
              : ds.type.insightValue,
          'leading-tight tabular-nums',
        )}
      >
        {isWalletCard ? (
          <MaskedInsightValue visible={isValueVisible} value={item.value} hiddenValue={hiddenValue} />
        ) : (
          displayValue
        )}
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
          <div className="flex min-w-0 items-center gap-2.5">
            <div className={iconBoxClass}>
              <span className={iconInnerClass}>{item.icon}</span>
            </div>
            <div className="min-w-0 text-right">
              <p className={classNames(ds.type.insightTitle, 'truncate')}>{item.title}</p>
              {item.description ? (
                <p className={classNames(ds.type.captionSm, 'mt-0.5 truncate')}>{item.description}</p>
              ) : null}
            </div>
          </div>
          {item.isLoading ? (
            <Skeleton h="1rem" w="4.5rem" rounded="md" className="shrink-0" />
          ) : (
            <div className="flex shrink-0 items-center gap-1.5 ps-2">
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
        <div className="flex min-w-0 items-center gap-2.5">
          <div className={iconBoxClass}>
            <span className={iconInnerClass}>{item.icon}</span>
          </div>
          <div className="min-w-0 text-right">
            <p className={classNames(ds.type.insightTitle, 'truncate')}>{item.title}</p>
            {item.isLoading ? (
              <Skeleton h="0.5rem" w="4.5rem" rounded="md" className="mt-1" />
            ) : (
              item.description && (
                <p className={classNames(ds.type.captionSm, 'mt-0.5 flex items-center gap-1 truncate')}>
                  <span className="truncate">{item.description}</span>
                  {item.trendPercent != null ? <InsightTrendChip percent={item.trendPercent} /> : null}
                </p>
              )
            )}
          </div>
        </div>
        <div className="shrink-0 ps-2">{renderMetricValue(true)}</div>
      </div>
    );
  }

  return (
    <div
      className={classNames(cardClassName, isWalletCard && item.onPress && 'cursor-pointer')}
      {...walletInteractiveProps}
    >
      {glassFlash ? <InsightCardGlassFlash /> : null}
      <div className="flex items-center gap-2">
        <div className={iconBoxClass}>
          <span className={iconInnerClass}>{item.icon}</span>
        </div>
        <p className={classNames(ds.type.insightTitle, 'min-w-0 flex-1 truncate')}>{item.title}</p>
        {walletToggle}
      </div>
      <div className="mt-auto min-w-0">
        {renderMetricValue(false, true)}
        {item.isLoading ? (
          <Skeleton h="0.625rem" w="45%" rounded="md" className="mt-1.5" />
        ) : item.description ? (
          <p className={classNames(ds.type.caption, 'mt-1.5 flex items-center gap-1')}>
            <span className="truncate">{item.description}</span>
            {item.trendPercent != null ? <InsightTrendChip percent={item.trendPercent} /> : null}
          </p>
        ) : item.trendPercent != null ? (
          <div className="mt-1.5">
            <InsightTrendChip percent={item.trendPercent} />
          </div>
        ) : null}
      </div>
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

  const renderInsightItem = (
    item: DsInsightItem,
    index: number,
    fullWidth = false,
    compact = false,
    grouped = false,
    isLast = false,
  ) => {
    const card = (
      <InsightCard
        item={item}
        fullWidth={fullWidth}
        appearance={appearance}
        compact={compact}
        grouped={grouped}
        isLast={isLast}
        shouldIgnorePress={!fullWidth ? wasDragged : undefined}
      />
    );

    if (item.onPress && !item.visibilityToggle) {
      return (
        <button
          key={index}
          type="button"
          className={classNames('flex h-full text-start', dsFocusRing, fullWidth && 'w-full')}
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
        <div key={index} className={fullWidth ? 'flex h-full w-full shrink-0' : 'flex h-full shrink-0'}>
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
          className={fullWidth ? 'flex h-full w-full' : 'flex h-full'}
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
      <div key={index} className={fullWidth ? 'flex h-full w-full' : 'flex h-full shrink-0'}>
        {card}
      </div>
    );
  };

  const renderStackItems = (grouped: boolean) =>
    items.map((item, index) =>
      renderInsightItem(item, index, true, true, grouped, grouped && index === items.length - 1),
    );

  const showGrid = variant === 'grid' || variant === 'responsive';
  const showCarousel = variant === 'carousel' || variant === 'responsive';
  const showStack = variant === 'stack';

  return (
    <div className={className}>
      {showStack && appearance === 'workstation' && (
        <div role="region" aria-label="آمار عملکرد">
          <DsCard padding="none" className="overflow-hidden">
            {renderStackItems(true)}
          </DsCard>
        </div>
      )}

      {showStack && appearance !== 'workstation' && (
        <div className="flex flex-col gap-2" role="region" aria-label="آمار عملکرد">
          {renderStackItems(false)}
        </div>
      )}

      {showGrid && (
        <div className={classNames('grid grid-cols-4 items-stretch gap-3', variant === 'responsive' && 'hidden md:grid')}>
          {items.map((item, index) => renderInsightItem(item, index, true))}
        </div>
      )}

      {showCarousel && (
      <div
        className={classNames(
          'relative -mx-4 overflow-x-clip',
          ds.surface.page,
          hasBandPadding ? 'pb-3' : '',
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
            'relative z-[1] overflow-x-auto px-4 pt-0',
            hasBandPadding ? 'pb-2.5' : 'pb-0',
            'cursor-grab select-none touch-none no-scroll active:cursor-grabbing',
          )}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <animated.div
            ref={trackRef}
            className="flex w-max items-stretch gap-2.5 will-change-transform"
            style={{
              x: spring.pull,
            }}
          >
            {items.map((item, index) => (
              <div key={index} className="flex shrink-0 self-stretch">
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
