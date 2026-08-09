import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from './tokens';

type DsBadgeTone = 'neutral' | 'success' | 'online' | 'warning';

const toneStyles: Record<DsBadgeTone, string> = {
  neutral: classNames(ds.surface.neutralSoft, 'text-slate-600'),
  success: 'bg-secondary/10 text-secondary',
  online: classNames(ds.icon.bg, ds.icon.color),
  warning: classNames(ds.surface.warningSoft, 'text-amber-700'),
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
      'inline-flex items-center rounded-full px-2.5 py-0.5',
      ds.type.badge,
      toneStyles[tone],
      className,
    )}
  >
    {children}
  </span>
);
