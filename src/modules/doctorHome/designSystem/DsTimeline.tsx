import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { TimelineDoneIcon } from '../components/icons';
import { dsFocusRing } from '../utils/a11y';
import { ds } from './tokens';

export type TimelineStatus = 'done' | 'current' | 'upcoming';

export const DsTimeline = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={classNames('relative', className)}>{children}</div>
);

export const DsTimelineItem = ({
  status,
  isLast,
  compact,
  children,
}: {
  status: TimelineStatus;
  isLast?: boolean;
  compact?: boolean;
  children: ReactNode;
}) => (
  <div className={classNames('relative flex', compact ? 'gap-2.5 pb-0.5' : 'gap-4 pb-1')}>
    <div className={classNames('flex shrink-0 flex-col items-center', compact ? 'w-5' : 'w-6')}>
      <div
        className={classNames(
          'relative z-10 flex items-center justify-center rounded-full',
          compact ? 'h-5 w-5' : 'h-6 w-6',
          ds.timeline[status],
          ds.motion.surface,
        )}
      >
        {status === 'done' && <TimelineDoneIcon />}
        {status === 'current' && (
          <span className={classNames('rounded-full bg-white', compact ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
        )}
      </div>
      {!isLast && (
        <div
          className={classNames(
            'mt-0.5 w-0 flex-1 border-r-2 border-dashed',
            status === 'current' || status === 'done' ? ds.timeline.lineActive : ds.timeline.line,
          )}
          aria-hidden
        />
      )}
    </div>
    <div className={classNames('min-w-0 flex-1', compact ? 'pb-2.5' : 'pb-4')}>{children}</div>
  </div>
);

export const DsTaskCard = ({
  title,
  meta,
  children,
  trailing,
  href,
  onClick,
  compact,
  highlighted,
  className,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  compact?: boolean;
  highlighted?: boolean;
  className?: string;
}) => {
  const innerClassName = classNames(
    compact ? ds.radius.inner : ds.radius.card,
    compact ? 'border border-slate-100/80 bg-white p-3' : classNames(ds.surface.card, ds.layout.sectionCardPadding),
    !compact && ds.shadow.sm,
    highlighted && classNames('border-primary/20 bg-primary/[0.02] ring-1 ring-primary/10'),
    (href || onClick) && classNames(ds.motion.surface, ds.motion.press, 'hover:border-slate-200/80 hover:shadow-sm'),
    className,
  );

  const inner = (
    <>
      <div className={classNames('flex items-start justify-between', compact ? 'gap-2' : 'gap-3')}>
        <div className="min-w-0 flex-1">
          <p className={compact ? ds.type.cardTitleSemibold : ds.type.cardTitle}>{title}</p>
          {meta && (
            <p className={classNames(compact ? ds.type.caption : ds.type.cardBody, 'mt-0.5 line-clamp-2')}>
              {meta}
            </p>
          )}
        </div>
        {trailing}
      </div>
      {children && <div className={compact ? 'mt-2' : 'mt-3'}>{children}</div>}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classNames('block', dsFocusRing, innerClassName)}>
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classNames('block w-full text-start', dsFocusRing, innerClassName)}
      >
        {inner}
      </button>
    );
  }

  return <div className={innerClassName}>{inner}</div>;
};
