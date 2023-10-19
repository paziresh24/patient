import Text from '@/common/components/atom/text';
import Transition from '@/common/components/atom/transition';
import ChevronIcon from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, isValidElement, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

interface MenuItemProps {
  name: string;
  icon?: string | ReactNode;
  link?: string;
  subMenu?: MenuItemProps[];
  className?: string;
  type?: 'parent' | 'children';
}

export const MenuItem = ({ name, icon, link, subMenu, className, type = 'parent' }: MenuItemProps) => {
  const router = useRouter();
  const isSubMenu = !!subMenu && subMenu?.length > 0;
  const ComponentWrapper = link ? Link : ('div' as any);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(
    ref,
    () => {
      if (isOpen) setIsOpen(false);
    },
    ['click'],
  );

  return (
    <div ref={ref}>
      <ComponentWrapper
        {...{
          ...(link && { href: link }),
          ...(subMenu && subMenu?.length > 0 && { onClick: () => setIsOpen(prev => !prev) }),
        }}
        className={classNames(
          'flex cursor-pointer hover:bg-slate-5 rounded-md items-center px-3 py-2 whitespace-nowrap',
          {
            'justify-between': isSubMenu,
            '!pr-6': type === 'children',
            'bg-slate-100': type === 'parent' && router.asPath == link,
            'before:absolute before:content before:right-[-1.5px] before:rounded-full before:w-1 before:h-[70%] relative before:bg-primary':
              type === 'children' && router.asPath == link,
          },
          className,
        )}
      >
        <div className="flex items-center space-s-2 ">
          {icon && (isValidElement(icon) ? icon : <img src={icon as string} width={23} height={23} alt={name} />)}
          <Text fontWeight="medium" fontSize="sm">
            {name}
          </Text>
        </div>
        {isSubMenu && <ChevronIcon dir={isOpen ? 'left' : 'bottom'} />}
      </ComponentWrapper>
      {isSubMenu && (
        <Transition match={isOpen} animation="right">
          <div className="relative mr-[1.4rem] mt-1 before:content  before:absolute before:top-2 before:right-0 before:rounded-full before:bg-slate-200 before:w-[2px] before:h-[80%]">
            {subMenu?.map(menuItem => (
              <MenuItem className="py-2 rounded-none" key={menuItem.name} {...menuItem} type="children" />
            ))}
          </div>
        </Transition>
      )}
    </div>
  );
};

export default MenuItem;
