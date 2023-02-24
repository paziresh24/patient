import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
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
    <li className={clsx('font-medium', className)}>
      <Component href={link} prefetch={false} {...rest} className="relative flex items-center justify-between py-3" onClick={rest.onClick}>
        <div className="flex items-center space-s-2 whitespace-nowrap">
          {icon}
          <Text fontSize="sm">{name}</Text>
        </div>
        {children}
      </Component>
    </li>
  );
};

export default MenuItem;
