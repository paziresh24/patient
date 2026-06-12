'use client';
import { Drawer } from 'vaul';
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from '@/common/utils/classNames';

const SNAP_MAX = 0.9;

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
}

export const DsDrawer = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
  level = 0,
  fullHeight = false,
  nested = false,
}: DsDrawerProps) => {
  const Root = nested ? Drawer.NestedRoot : Drawer.Root;
  const measureRef = useRef<HTMLDivElement>(null);
  const [snapMin, setSnapMin] = useState(0.6);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  // محاسبه‌ی ارتفاع از روی محتوای واقعی داخل div مخفی
  const computeSnap = useCallback(() => {
    if (fullHeight) return; // حالت ۹۰٪ ثابت — اندازه‌گیری لازم نیست
    const el = measureRef.current;
    if (!el) return;
    const contentH = el.scrollHeight;
    // محتوا هنوز آماده نیست (داده/URL با تأخیر میاد) — مقدار قبلی رو نگه دار، روی 0.15 نیفت
    if (contentH < 20) return;
    const vh = window.innerHeight || 800;
    // ارتفاع واقعی chrome شیت: handle (~22px) + نوار title (~50px با border).
    // پدینگ پایین محتوا داخل خود children هست (pb-8) پس اینجا اضافه نمی‌کنیم.
    const handleH = 22;
    const titleH = title ? 46 : 0;
    const totalH = handleH + titleH + contentH; // بدون buffer اضافه — دقیقاً اندازه محتوا
    const frac = totalH / vh;
    setSnapMin(Math.min(Math.max(frac, 0.15), 0.6));
  }, [title, fullHeight]);

  // اندازه‌گیری دقیقاً وقتی open=true میشه + رصد تغییرات محتوا (داده‌ی async، reflow فونت)
  // useLayoutEffect قبل از paint اجرا میشه، پس مقدار اولیه قبل از mount شدن Drawer.Root آماده‌ست.
  // ResizeObserver هر بار که ارتفاع محتوا عوض شد دوباره حساب می‌کنه و شیت خودش رو تصحیح می‌کنه.
  useLayoutEffect(() => {
    if (!open) return;
    computeSnap();
    const el = measureRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => computeSnap());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, computeSnap]);

  // remeasure بعد از load شدن فونت‌ها (فارسی دیرتر میاد و متن reflow میشه)
  useEffect(() => {
    if (!open) return;
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    fonts?.ready?.then(() => computeSnap());
  }, [open, computeSnap]);

  // mounted جدا از open تا انیمیشن close کامل بشه
  // useEffect = بعد از useLayoutEffect اجرا میشه، پس snapMin قبلاً set شده
  useEffect(() => {
    clearTimeout(closeTimer.current);
    if (open) {
      setMounted(true);
    } else if (mounted) {
      closeTimer.current = setTimeout(() => setMounted(false), 350);
    }
    return () => clearTimeout(closeTimer.current);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* همیشه render میشه تا hidden div محتوا داشته باشه موقع اندازه‌گیری */}
      <div
        ref={measureRef}
        aria-hidden="true"
        dir="rtl"
        style={{
          position: 'fixed',
          top: '-200vh',
          left: 0,
          width: '100vw',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {!fullHeight && children}
      </div>

      {/* vaul به‌صورت پیش‌فرض روی اولین snap point باز میشه؛ چون هر بار باز شدن
          یه mount تازه‌ست (شرط mounted)، همیشه از index 0 شروع میشه. */}
      {mounted && (
        <Root
          open={open}
          onOpenChange={onOpenChange}
          snapPoints={fullHeight ? [SNAP_MAX] : [snapMin, SNAP_MAX]}
          fadeFromIndex={0}
        >
          {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/50" style={{ zIndex: 200 + level * 10 }} />
            <Drawer.Content
              className="fixed inset-x-0 bottom-0 flex h-screen flex-col rounded-t-[24px] bg-white outline-none"
              style={{ zIndex: 201 + level * 10 }}
              dir="rtl"
            >
              {/* Drawer.Handle = دستگیره‌ی درگ واقعی vaul با ناحیه‌ی لمسی بزرگ
                  تا حتی وقتی iframe زیرش هست با درگ بشه شیت رو بست */}
              <div className="flex shrink-0 cursor-grab justify-center pt-3.5 pb-2 active:cursor-grabbing">
                <Drawer.Handle className="!h-1 !w-10 !rounded-full !bg-slate-200" />
              </div>
              {title ? (
                <Drawer.Title className="border-b border-slate-100 px-5 py-3 text-base font-bold text-slate-900">
                  {title}
                </Drawer.Title>
              ) : (
                <Drawer.Title className="sr-only">{description ?? 'sheet'}</Drawer.Title>
              )}
              {description && (
                <Drawer.Description className="sr-only">{description}</Drawer.Description>
              )}
              <div className={classNames('flex-1 overflow-y-auto overscroll-contain', className)}>
                {children}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Root>
      )}
    </>
  );
};
