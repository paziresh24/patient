import classNames from '@/common/utils/classNames';
import { CSSProperties, ReactNode } from 'react';
import { ds } from '../designSystem';

type FeedMotionProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  style?: CSSProperties;
};

export const FeedMotion = ({ children, className, index = 0, style }: FeedMotionProps) => (
  <div
    className={classNames(ds.motion.enter, className)}
    style={{
      animationDelay: `${Math.min(index, 12) * ds.motion.staggerMs}ms`,
      ...style,
    }}
  >
    {children}
  </div>
);
