import classNames from '@/common/utils/classNames';
import { HTMLAttributes, ReactNode } from 'react';

interface MenuListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export const MenuList = (props: MenuListProps) => {
  const { children, className } = props;
  return <ul className={classNames('list-none flex flex-col', className)}>{children}</ul>;
};

export default MenuList;
