import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
const Transition = dynamic(() => import('@/common/components/atom/transition'));
interface Item {
  title: React.ReactNode;
  link?: string;
  icon?: React.ReactNode;
}
interface SubMenuProps {
  title: React.ReactNode;
  className?: '';
  menuItem: Item[];
  hasIcon?: boolean;
}

const SubMenu = ({ title, menuItem, hasIcon = true, className }: SubMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });
  return (
    <li ref={ref} className="relative flex items-center" onClick={() => setOpen(!open)}>
      <div className="text-center cursor-pointer p-3 text-sm md:p-6 md:pl-4 font-medium flex items-center space-s-1">{title}</div>
      {hasIcon && <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />}
      <Transition
        as="ul"
        match={open}
        animation="bottom"
        className="absolute shadow-md min-w-full text-slate-700 font-medium whitespace-nowrap z-50 py-3 px-2 overflow-auto bg-white border border-slate-300 rounded-2xl max-w-xs w-max  top-16 md:ml-0"
      >
        {menuItem.map((item, index) => {
          return (
            <li key={index}>
              <Link href={item.link ?? '#'}>
                <a className="flex items-center py-3 px-3 space-s-2 text-sm cursor-pointer">
                  {item.icon && item.icon}
                  <Text>{item.title}</Text>
                </a>
              </Link>
            </li>
          );
        })}
      </Transition>
    </li>
  );
};

export default SubMenu;
