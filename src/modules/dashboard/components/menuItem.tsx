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
}

export const MenuItem = ({ name, icon, link, subMenu }: MenuItemProps) => {
  const router = useRouter();
  const isSubMenu = !!subMenu && subMenu?.length > 0;
  const ComponentWrapper = !isSubMenu && link ? Link : ('div' as any);
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
          ...(link && !isSubMenu && { href: link }),
          ...(subMenu && subMenu?.length > 0 && { onClick: () => setIsOpen(prev => !prev) }),
        }}
        className={classNames(
          'flex cursor-pointer hover:bg-slate-50 rounded-lg items-center px-5 py-4 border-b whitespace-nowrap border-slate-100/50',
          {
            'justify-between': isSubMenu,
            'bg-slate-100': router.asPath == link,
          },
        )}
      >
        <div className="flex items-center space-s-2 ">
          {icon && (isValidElement(icon) ? icon : <img src={icon as string} width={24} height={24} alt={name} />)}
          <Text fontWeight="medium" fontSize="sm">
            {name}
          </Text>
        </div>
        {isSubMenu && <ChevronIcon dir={isOpen ? 'left' : 'bottom'} />}
      </ComponentWrapper>
      {isSubMenu && (
        <Transition match={isOpen} animation="right">
          <div className="mr-8">
            {subMenu?.map(menuItem => (
              <MenuItem key={menuItem.name} {...menuItem} />
            ))}
          </div>
        </Transition>
      )}
    </div>
  );
};

export default MenuItem;
