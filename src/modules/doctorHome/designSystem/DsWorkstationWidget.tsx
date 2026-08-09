import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import { ds } from './tokens';

export const DsWorkstationWidget = ({
  children,
  className,
  padding = 'md',
}: {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div className={classNames(ds.workstation.widget, paddingMap[padding], className)}>
      {children}
    </div>
  );
};
