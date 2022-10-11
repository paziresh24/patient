import clsx from 'clsx';
import { HTMLAttributes } from 'react';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  width?: number | string;
  height?: number | string;
  orientation?: 'vertical' | 'horizontal';
}

export const Divider = (props: DividerProps) => {
  const { height, width, orientation = 'horizontal', className, ...rest } = props;
  const borderWidth = orientation === 'horizontal' ? width ?? '100%' : width ?? '1px';
  const borderHeight = orientation === 'horizontal' ? height ?? '1px' : height ?? '100%';

  return <hr className={clsx('bg-slate-200 border-none', className)} style={{ width: borderWidth, height: borderHeight }} {...rest} />;
};

export default Divider;
