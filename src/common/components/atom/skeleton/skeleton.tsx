import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';

interface SkeletonProps {
  w?: string;
  h?: string;
  rounded?: 'none' | 'lg' | 'md' | 'sm' | 'xs' | 'full';
  className?: string;
  children?: ReactNode;
}

const skeletonStyles = {
  rounded: {
    none: 'rounded-none',
    lg: 'rounded-lg',
    md: 'rounded-md',
    sm: 'rounded-sm',
    xs: 'rounded-xs',
    full: 'rounded-full',
  },
};

export const Skeleton: React.FC<SkeletonProps> = props => {
  const { w = '5rem', h = '5rem', rounded = 'none', className, children } = props;

  return (
    <div
      style={{ width: w, height: h }}
      className={classNames('animate-pulse duration-75 bg-slate-200', skeletonStyles.rounded[rounded], className)}
    >
      {children}
    </div>
  );
};

export default Skeleton;
