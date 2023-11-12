import Text from '@/common/components/atom/text';
import Transition from '@/common/components/atom/transition';
import ChevronIcon from '@/common/components/icons/chevron';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, isValidElement, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

interface MenuItemProps {
  name: string;
  icon?: string | ReactNode;
  button?: ReactNode;
  link?: string;
  subMenu?: MenuItemProps[];
  className?: string;
  type?: 'parent' | 'children';
  pattern?: string;
  onEvent?: (label: string) => void;
}

export const MenuItem = ({ name, icon, button, link, onEvent, subMenu, className, type = 'parent', pattern = '' }: MenuItemProps) => {
  const router = useRouter();
  const isSubMenu = !!subMenu && subMenu?.length > 0;
  const { isMobile } = useResponsive();
  const ComponentWrapper = (isMobile ? (type === 'parent' ? link && !isSubMenu : true) : !!link) ? Link : ('div' as any);
  const [isOpen, setIsOpen] = useState(router.asPath.includes(pattern));
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
          ...(link && { href: link, onClick: () => onEvent?.(name) }),
          ...(subMenu &&
            subMenu?.length > 0 && {
              onClick: () => {
                setIsOpen(prev => !prev);
                onEvent?.(name);
              },
            }),
        }}
        className={classNames(
          'flex cursor-pointer  rounded-md items-center px-2 py-2 whitespace-nowrap',
          {
            '!pr-6 before:transition-all before:duration-300 before:opacity-0 hover:opacity-80 duration-300 transition-all':
              type === 'children',
            ' hover:bg-slate-50 duration-300 transition-all justify-between': type === 'parent',
            'bg-slate-100': type === 'parent' && router.asPath === link,
            'before:absolute before:opacity-100  before:content before:right-[-1.5px] before:rounded-full before:w-1 before:h-[80%] relative before:bg-primary':
              type === 'children' && router.asPath == link,
            'pl-4': isSubMenu,
          },
          className,
        )}
      >
        <div className="flex items-center space-s-2">
          {icon && (isValidElement(icon) ? icon : <img src={icon as string} width={23} height={23} alt={name} />)}
          <Text fontWeight="medium" fontSize="sm">
            {name}
          </Text>
        </div>
        {button}
        {isSubMenu && <ChevronIcon dir={isOpen ? 'left' : 'bottom'} />}
      </ComponentWrapper>
      {isSubMenu && (
        <Transition match={isOpen} animation="right">
          <div className="relative mr-[1.15rem] mt-1 before:content  before:absolute flex flex-col justify-center before:right-0 before:rounded-full before:bg-slate-200 before:w-[2px] before:h-[80%]">
            {subMenu?.map(menuItem => (
              <MenuItem className="py-2 rounded-none" onEvent={onEvent} key={menuItem.name} {...menuItem} type="children" />
            ))}
          </div>
        </Transition>
      )}
    </div>
  );
};

export default MenuItem;
