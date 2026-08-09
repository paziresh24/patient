import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from '../designSystem';

export const DsCollapsible = ({
  open,
  children,
  className,
  id,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}) => (
  <div
    id={id}
    className={classNames(
      'grid',
      ds.motion.collapse,
      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      className,
    )}
  >
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
);
