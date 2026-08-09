import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from '../designSystem';

type FeedContentSwapVariant = 'fade-up' | 'fade' | 'slide' | 'pop';

const variantClass: Record<FeedContentSwapVariant, string> = {
  'fade-up': ds.motion.contentSwap,
  fade: ds.motion.contentFade,
  slide: ds.motion.contentSlide,
  pop: ds.motion.pop,
};

/** با عوض شدن swapKey محتوا دوباره animate می‌شود — مثل تعویض تاریخ یا فیلتر */
export const FeedContentSwap = ({
  swapKey,
  children,
  className,
  variant = 'fade-up',
}: {
  swapKey: string | number;
  children: ReactNode;
  className?: string;
  variant?: FeedContentSwapVariant;
}) => (
  <div key={swapKey} className={classNames(variantClass[variant], className)}>
    {children}
  </div>
);

export const FeedStaggerItem = ({
  index,
  children,
  className,
  stepMs = 45,
}: {
  index: number;
  children: ReactNode;
  className?: string;
  stepMs?: number;
}) => (
  <div
    className={classNames(ds.motion.contentSwap, className)}
    style={{ animationDelay: `${Math.min(index, 14) * stepMs}ms` }}
  >
    {children}
  </div>
);
