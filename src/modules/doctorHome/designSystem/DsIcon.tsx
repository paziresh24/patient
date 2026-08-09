import classNames from '@/common/utils/classNames';
import type { LucideIcon, LucideProps } from 'lucide-react';

export const DS_ICON_STROKE = 2;

export type DsIconSize = 'xs' | 'sm' | 'md' | 'lg';

const sizeClass: Record<DsIconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-5 w-5',
};

export type DsIconProps = {
  icon: LucideIcon;
  size?: DsIconSize;
  className?: string;
} & Omit<LucideProps, 'ref'>;

export const DsIcon = ({ icon: Icon, size = 'sm', className, strokeWidth = DS_ICON_STROKE, ...props }: DsIconProps) => (
  <Icon
    className={classNames(sizeClass[size], 'shrink-0', className)}
    strokeWidth={strokeWidth}
    aria-hidden
    {...props}
  />
);
