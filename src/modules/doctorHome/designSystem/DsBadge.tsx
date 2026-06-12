import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

type DsBadgeTone = 'neutral' | 'success' | 'online' | 'warning';

const toneStyles: Record<DsBadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-secondary/10 text-secondary',
  online: 'bg-primary/10 text-primary',
  warning: 'bg-amber-50 text-amber-700',
};

export const DsBadge = ({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: DsBadgeTone;
  className?: string;
}) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
      toneStyles[tone],
      className,
    )}
  >
    {children}
  </span>
);
