import Link from 'next/link';
import { LiHTMLAttributes, ReactNode } from 'react';
import Text from '../text';

interface MenuItemProps extends LiHTMLAttributes<HTMLLIElement> {
  link?: string;
  icon?: ReactNode;
  name: string;
  children?: ReactNode;
}

export const MenuItem = (props: MenuItemProps) => {
  const { link = '', name, icon, children, ...rest } = props;

  return (
    <li {...rest}>
      <Link href={link} prefetch={false}>
        <a className="py-3 flex items-center justify-between relative">
          <div className="flex items-center space-s-3 whitespace-nowrap">
            {icon}
            <Text fontSize="sm" fontWeight="medium">
              {name}
            </Text>
          </div>
          {children}
        </a>
      </Link>
    </li>
  );
};

export default MenuItem;
