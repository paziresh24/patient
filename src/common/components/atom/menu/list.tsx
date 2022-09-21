import clsx from 'clsx';
import { HTMLAttributes, ReactNode } from 'react';

interface MenuListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export const MenuList = (props: MenuListProps) => {
  const { children, className } = props;
  return <ul className={clsx('list-none flex flex-col', className)}>{children}</ul>;
};

export default MenuList;
