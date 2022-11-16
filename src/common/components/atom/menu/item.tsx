import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import Text from '../text';

interface MenuItemProps extends Omit<LinkProps, 'href'> {
  link?: string;
  icon?: ReactNode;
  name: string;
  children?: ReactNode;
  className?: string;
  postFix?: ReactNode;
  preFix?: ReactNode;
}

export const MenuItem = (props: MenuItemProps) => {
  const { link = '', name, icon, children, className, postFix, preFix, ...rest } = props;

  const Component = link ? Link : 'div';

  return (
    <li className={clsx('font-medium', className)}>
      <Component href={link} prefetch={false} {...rest}>
        <a className="relative flex items-center justify-between py-3" onClick={rest.onClick}>
          <div className="flex items-center space-s-2 whitespace-nowrap">
            {icon}
            {preFix}
            <Text fontSize="sm">{name}</Text>
            {postFix}
          </div>
          {children}
        </a>
      </Component>
    </li>
  );
};

export default MenuItem;
