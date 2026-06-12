import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ds } from './tokens';

export type TimelineStatus = 'done' | 'current' | 'upcoming';

const DoneIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DsTimeline = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={classNames('relative', className)}>{children}</div>
);

export const DsTimelineItem = ({
  status,
  isLast,
  children,
}: {
  status: TimelineStatus;
  isLast?: boolean;
  children: ReactNode;
}) => (
  <div className="relative flex gap-4 pb-1">
    <div className="flex w-6 shrink-0 flex-col items-center">
      <div
        className={classNames(
          'relative z-10 flex h-6 w-6 items-center justify-center rounded-full',
          ds.timeline[status],
        )}
      >
        {status === 'done' && <DoneIcon />}
        {status === 'current' && <span className="h-2 w-2 rounded-full bg-white" />}
      </div>
      {!isLast && (
        <div className={classNames('mt-1 w-0 flex-1 border-r-2 border-dashed', ds.timeline.line)} aria-hidden />
      )}
    </div>
    <div className="min-w-0 flex-1 pb-4">{children}</div>
  </div>
);

export const DsTaskCard = ({
  title,
  meta,
  children,
  trailing,
  href,
  onClick,
  className,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) => {
  const inner = (
    <div
      className={classNames(
        ds.radius.card,
        'border border-slate-100 bg-white p-4 shadow-sm',
        (href || onClick) && 'cursor-pointer transition-transform active:scale-[0.99]',
        className,
      )}
      onClick={!href ? onClick : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={ds.type.cardTitle}>{title}</p>
          {meta && <p className={classNames(ds.type.cardBody, 'mt-1')}>{meta}</p>}
        </div>
        {trailing}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
};
