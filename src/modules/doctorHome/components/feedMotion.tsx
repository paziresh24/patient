import classNames from '@/common/utils/classNames';
import { Children, CSSProperties, ReactNode } from 'react';
import { ds } from '../designSystem';

type FeedMotionProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  style?: CSSProperties;
};

/** Skip empty wrappers so flex `gap` does not leave blank bands between sections. */
export const FeedMotion = ({ children, className, index = 0, style }: FeedMotionProps) => {
  const hasContent = Children.toArray(children).some(child => child != null && child !== false);
  if (!hasContent) return null;

  return (
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
};
