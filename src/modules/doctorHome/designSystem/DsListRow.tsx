import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from './tokens';

export const DsListRow = ({
  leading,
  title,
  subtitle,
  trailing,
  className,
}: {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  className?: string;
  isLast?: boolean;
}) => (
  <div className={classNames('flex items-center', ds.layout.listRowGap, className)}>
    {leading && <div className="shrink-0">{leading}</div>}
    <div className="min-w-0 flex-1">
      <p className={classNames(ds.type.cardTitle, 'truncate')}>{title}</p>
      {subtitle && <p className={classNames(ds.type.caption, 'mt-0.5 truncate')}>{subtitle}</p>}
    </div>
    {trailing && <div className="shrink-0 text-left">{trailing}</div>}
  </div>
);
