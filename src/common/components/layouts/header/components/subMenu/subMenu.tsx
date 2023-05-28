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
    <li ref={ref} className="relative flex items-center" onClick={() => setOpen(prev => !prev)}>
      <div className="flex items-center text-center cursor-pointer">
        <Text fontSize="sm" className="p-3" fontWeight="medium">
          {title}
        </Text>
        {hasIcon && <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />}
      </div>
      <Transition
        as="ul"
        match={open}
        animation="bottom"
        className="absolute z-50 max-w-xs min-w-full px-2 py-3 overflow-auto font-medium bg-white border shadow-md text-slate-700 whitespace-nowrap border-slate-200 rounded-2xl w-max top-12 md:ml-0"
      >
        {menuItem.map((item, index) => {
          return (
            <li key={index}>
              <Link href={item.link ?? '#'} className="flex items-center px-3 py-3 text-sm cursor-pointer space-s-2">
                {item.icon && item.icon}
                <Text>{item.title}</Text>
              </Link>
            </li>
          );
        })}
      </Transition>
    </li>
  );
};

export default SubMenu;
