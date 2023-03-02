import classNames from '@/common/utils/classNames';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import Text from '../text';

interface MenuItemProps extends Omit<LinkProps, 'href'> {
  link?: string;
  icon?: ReactNode;
  name: string;
  children?: ReactNode;
  className?: string;
}

export const MenuItem = (props: MenuItemProps) => {
  const { link = '', name, icon, children, className, ...rest } = props;

  const Component = link ? Link : ('div' as any);

  return (
    <li className={classNames('font-medium', className)}>
      <Component
        {...rest}
        {...(link && {
          href: link,
          prefetch: false,
        })}
        className="relative flex items-center cursor-pointer justify-between py-3"
        onClick={rest.onClick}
      >
        <div className="flex items-center space-s-2">
          {icon}
          <Text fontSize="sm">{name}</Text>
        </div>
        {children}
      </Component>
    </li>
  );
};

export default MenuItem;
