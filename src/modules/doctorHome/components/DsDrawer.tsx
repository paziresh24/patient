'use client';
import ClientOnlyPortal from '@/common/components/layouts/clientOnlyPortal';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import { X } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';
import { ds } from '../designSystem/tokens';
import { prefersReducedMotion } from '../utils/a11y';
import { originTransformOrigin, type OriginRect } from '../utils/sharedElement';
import { SharedElementFlight } from './sharedElementFlight';

/**
 * بالاتر از هدر/ناوبری (z-40/50) و پایین‌تر از `z-infinity` (999) —
 * تا مودال پرداخت و لاگین روی شیت اپ دیده شوند، نه زیر آن.
 */
const DRAWER_BASE_Z = 900;
const DESKTOP_EXIT_MS = 200;
const MOBILE_CLICK_SHIELD_MS = 500;

interface DsDrawerProps {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** مودال‌های روی‌هم (stacked): level بالاتر = z-index بالاتر تا overlay روی مودال قبلی بیفته */
  level?: number;
  /** شیت رو ثابت روی ۹۰٪ باز می‌کنه (بدون اندازه‌گیری محتوا — مناسب iframe و محتوای بلند) */
  fullHeight?: boolean;
  /** وقتی این شیت داخل یک شیت دیگر باز میشه (nested) — از Drawer.NestedRoot وال استفاده می‌کنه */
  nested?: boolean;
  /**
   * فقط دسکتاپ: پنل تقریبا تمام‌صفحه می‌شود (اجرای فول‌اسکرین ابزارک) —
   * لبه‌ها به‌خاطر padding دور پنل دیده می‌شوند و کلیک روی پس‌زمینه می‌بندد.
   */
  expanded?: boolean;
  /** کارت مبدأ برای shared-element و origin-aware دسکتاپ */
  originRect?: OriginRect | null;
}

const DesktopDrawerPanel = ({
  title,
  description,
  children,
  className,
  fullHeight,
  expanded,
  level,
  closing,
  onClose,
  originRect,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  expanded?: boolean;
  level: number;
  closing: boolean;
  onClose: () => void;
  originRect?: OriginRect | null;
}) => {
  const isFlush = className?.includes('!p-0');
  const accessibleLabel = title ?? description ?? 'sheet';
  const overlayZ = DRAWER_BASE_Z + level * 10;
  const panelZ = DRAWER_BASE_Z + 1 + level * 10;
  const panelRef = useRef<HTMLDivElement>(null);
  const [transformOrigin, setTransformOrigin] = useState('50% 40%');
  const useOriginPop = !!originRect && !prefersReducedMotion();

  useLayoutEffect(() => {
    if (!originRect || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    setTransformOrigin(
      originTransformOrigin(originRect, { x: r.left, y: r.top, width: r.width, height: r.height }),
    );
  }, [originRect]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0" style={{ zIndex: overlayZ }} dir="rtl">
      <button
        type="button"
        aria-label="بستن"
        className={classNames(
          'absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]',
          closing ? ds.motion.backdropExit : ds.motion.backdropEnter,
        )}
        onClick={onClose}
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-5"
        style={{ zIndex: panelZ }}
      >
        <div
          ref={panelRef}
          className={classNames(
            'pointer-events-auto flex w-full items-start gap-3 transition-[max-width] duration-300',
            useOriginPop
              ? closing ? ds.motion.originExit : ds.motion.originEnter
              : closing ? ds.motion.sheetExit : ds.motion.sheetEnter,
            expanded ? 'max-w-[calc(100vw_-_2.5rem)]'
            : fullHeight ? 'max-w-[min(42rem,calc(100vw_-_2.5rem))]'
            : 'max-w-md',
          )}
          style={useOriginPop ? { transformOrigin } : undefined}
          dir="rtl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className={classNames(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200/80 hover:bg-slate-50 hover:text-slate-900',
              ds.motion.surface,
              ds.motion.press,
            )}
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={accessibleLabel}
            className={classNames(
              'flex min-w-0 flex-1 flex-col overflow-hidden bg-white outline-none',
              'rounded-2xl ring-1 ring-slate-200/80 shadow-[0_24px_64px_rgba(15,23,42,0.14)]',
              'transition-[height] duration-300',
              expanded ? 'h-[calc(100dvh_-_2.5rem)]'
              : fullHeight ? 'h-[min(88dvh,calc(100dvh_-_2.5rem))]'
              : 'max-h-[min(85vh,36rem)]',
            )}
          >
            <div
              className={classNames(
                'no-scroll flex min-h-0 flex-col overscroll-contain',
                fullHeight ? 'flex-1 overflow-hidden' : 'overflow-y-auto',
                '[&_*]:[-ms-overflow-style:none] [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden',
                !isFlush && 'p-4',
                className,
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileDrawerPanel = ({
  title,
  description,
  children,
  className,
  fullHeight,
  level,
  nested,
  trigger,
  mobileOpen,
  onMobileOpenChange,
  onAnimationEnd,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  level: number;
  nested?: boolean;
  trigger?: ReactNode;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  onAnimationEnd: (open: boolean) => void;
}) => {
  const Root = nested ? Drawer.NestedRoot : Drawer.Root;
  const isFlush = className?.includes('!p-0');
  const accessibleLabel = title ?? description ?? 'sheet';

  return (
    <Root
      open={mobileOpen}
      onOpenChange={onMobileOpenChange}
      onAnimationEnd={onAnimationEnd}
      handleOnly={false}
      modal
      repositionInputs={false}
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/50"
          style={{ zIndex: DRAWER_BASE_Z + level * 10 }}
        />
        <Drawer.Content
          className={classNames(
            'fixed inset-x-0 bottom-0 flex flex-col rounded-t-[24px] bg-white outline-none',
            fullHeight ? 'h-[90dvh] max-h-[90dvh]' : 'max-h-[90dvh]',
          )}
          style={{ zIndex: DRAWER_BASE_Z + 1 + level * 10 }}
          dir="rtl"
        >
          <div className="flex shrink-0 cursor-grab justify-center pt-3.5 pb-2 active:cursor-grabbing">
            <Drawer.Handle className="!h-1 !w-10 !rounded-full !bg-slate-200 transition-transform duration-200 active:scale-95" />
          </div>
          <Drawer.Title className="sr-only">{accessibleLabel}</Drawer.Title>
          {description ? <Drawer.Description className="sr-only">{description}</Drawer.Description> : null}
          <div
            className={classNames(
              'no-scroll flex min-h-0 flex-col overscroll-contain',
              fullHeight ? 'flex-1 overflow-hidden' : 'overflow-y-auto',
              '[&_*]:[-ms-overflow-style:none] [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden',
              !isFlush && 'pb-[max(1rem,env(safe-area-inset-bottom))]',
              className,
            )}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Root>
  );
};

export const DsDrawer = ({
  trigger,
  title,
  description,
  children,
  open = false,
  onOpenChange,
  className,
  level = 0,
  fullHeight = false,
  nested = false,
  expanded = false,
  originRect = null,
}: DsDrawerProps) => {
  const { isDesktop } = useResponsive();
  const [desktopVisible, setDesktopVisible] = useState(false);
  const [desktopClosing, setDesktopClosing] = useState(false);
  const [mobileMounted, setMobileMounted] = useState(open);
  const [mobileOpen, setMobileOpen] = useState(open);
  const [clickShield, setClickShield] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const shieldTimer = useRef<ReturnType<typeof setTimeout>>();
  const isClosingRef = useRef(false);
  const dismissPendingRef = useRef(false);
  const dismissSafetyTimer = useRef<ReturnType<typeof setTimeout>>();
  const openRef = useRef(open);
  const originRef = useRef<OriginRect | null>(originRect);
  const [flightActive, setFlightActive] = useState(false);
  const [flightClosing, setFlightClosing] = useState(false);

  if (originRect) originRef.current = originRect;

  openRef.current = open;

  const activateClickShield = useCallback(() => {
    setClickShield(true);
    clearTimeout(shieldTimer.current);
    shieldTimer.current = setTimeout(() => setClickShield(false), MOBILE_CLICK_SHIELD_MS);
  }, []);

  const finishMobileClose = useCallback(() => {
    if (!dismissPendingRef.current) return;
    const shouldNotifyParent = openRef.current;
    dismissPendingRef.current = false;
    isClosingRef.current = false;
    clearTimeout(dismissSafetyTimer.current);
    if (shouldNotifyParent) {
      activateClickShield();
      onOpenChange?.(false);
    }
  }, [activateClickShield, onOpenChange]);

  const scheduleDismissSafety = useCallback(() => {
    clearTimeout(dismissSafetyTimer.current);
    dismissSafetyTimer.current = setTimeout(() => finishMobileClose(), 700);
  }, [finishMobileClose]);

  const requestClose = useCallback(() => {
    if (!onOpenChange || !open) return;
    onOpenChange(false);
  }, [onOpenChange, open]);

  const beginMobileDismiss = useCallback(() => {
    if (!mobileOpen || isClosingRef.current) return;
    isClosingRef.current = true;
    dismissPendingRef.current = true;
    setMobileOpen(false);
    scheduleDismissSafety();
  }, [mobileOpen, scheduleDismissSafety]);

  const handleMobileOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        if (isClosingRef.current || dismissPendingRef.current || !openRef.current) return;
        setMobileOpen(true);
        return;
      }
      beginMobileDismiss();
    },
    [beginMobileDismiss],
  );

  const handleMobileAnimationEnd = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        finishMobileClose();
        return;
      }
      if (!openRef.current) {
        setMobileOpen(false);
      }
    },
    [finishMobileClose],
  );

  useEffect(() => {
    if (!isDesktop) return;

    if (open) {
      clearTimeout(closeTimer.current);
      setDesktopClosing(false);
      setDesktopVisible(true);
      return;
    }

    if (!desktopVisible) return;

    setDesktopClosing(true);
    closeTimer.current = setTimeout(() => {
      setDesktopVisible(false);
      setDesktopClosing(false);
    }, DESKTOP_EXIT_MS);
  }, [open, isDesktop, desktopVisible]);

  useEffect(() => {
    if (isDesktop) return;

    if (open) {
      // حتی وسط انیمیشن بسته‌شدن، اگر store دوباره open شد باید باز شود
      clearTimeout(dismissSafetyTimer.current);
      dismissPendingRef.current = false;
      isClosingRef.current = false;
      setMobileMounted(true);
      setMobileOpen(true);
      return;
    }

    if (!mobileMounted) return;

    if (!isClosingRef.current) {
      dismissPendingRef.current = true;
      isClosingRef.current = true;
      setMobileOpen(false);
      scheduleDismissSafety();
    }
  }, [open, isDesktop, mobileMounted, scheduleDismissSafety]);

  useEffect(() => {
    if (isDesktop) return;
    if (mobileOpen || !mobileMounted) return;

    const timer = setTimeout(() => {
      setMobileMounted(false);
      dismissPendingRef.current = false;
      isClosingRef.current = false;
    }, 600);

    return () => clearTimeout(timer);
  }, [isDesktop, mobileMounted, mobileOpen]);

  useEffect(() => {
    if (!originRef.current || prefersReducedMotion()) return;
    if (open) {
      setFlightClosing(false);
      setFlightActive(true);
      return;
    }
    if (flightActive) setFlightClosing(true);
  }, [open, flightActive]);

  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      clearTimeout(shieldTimer.current);
      clearTimeout(dismissSafetyTimer.current);
    },
    [],
  );

  if (isDesktop) {
    return (
      <>
        {trigger}
        {desktopVisible ? (
          <ClientOnlyPortal selector="body">
            <DesktopDrawerPanel
              title={title}
              description={description}
              className={className}
              fullHeight={fullHeight}
              expanded={expanded}
              level={level}
              closing={desktopClosing}
              originRect={originRef.current}
              onClose={requestClose}
            >
              {children}
            </DesktopDrawerPanel>
          </ClientOnlyPortal>
        ) : null}
        <SharedElementFlight
          active={flightActive}
          closing={flightClosing}
          origin={originRef.current}
          isDesktop
          fullHeight={fullHeight}
          onSettled={() => {
            if (flightClosing) {
              setFlightActive(false);
              setFlightClosing(false);
            }
          }}
        />
      </>
    );
  }

  if (!mobileMounted) {
    return <>{trigger}</>;
  }

  return (
    <>
      <ClientOnlyPortal selector="body">
        <MobileDrawerPanel
          title={title}
          description={description}
          className={className}
          fullHeight={fullHeight}
          level={level}
          nested={nested}
          trigger={trigger}
          mobileOpen={mobileOpen}
          onMobileOpenChange={handleMobileOpenChange}
          onAnimationEnd={handleMobileAnimationEnd}
        >
          {children}
        </MobileDrawerPanel>
      </ClientOnlyPortal>
      {clickShield ? (
        <ClientOnlyPortal selector="body">
          <div
            className="fixed inset-0 touch-none"
            style={{ zIndex: DRAWER_BASE_Z + 50 + level * 10 }}
            aria-hidden
          />
        </ClientOnlyPortal>
      ) : null}
      <SharedElementFlight
        active={flightActive}
        closing={flightClosing}
        origin={originRef.current}
        isDesktop={false}
        fullHeight={fullHeight}
        onSettled={() => {
          if (flightClosing) {
            setFlightActive(false);
            setFlightClosing(false);
          }
        }}
      />
    </>
  );
};
