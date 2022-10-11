import ChevronIcon from '@/common/components/icons/chevron';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import SidebarItem from './SidebarItem';

interface SidebarNavProps {
  menu: {
    title: string;
    items: {
      title: string;
      link: string;
      sub_menu?: {
        title: string;
        link: string;
      }[];
    }[];
  };
}
const SidebarNav = ({ menu }: SidebarNavProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (open) {
      setOpen(false);
    }
  });

  return (
    <li className="overflow-auto border-b max-h-96 border-slate-100">
      <div className="relative" ref={ref}>
        <span
          onClick={() => setOpen(prev => !prev)}
          className="sticky top-0 flex items-center justify-between px-3 py-6 text-sm bg-white z-infinity"
        >
          {menu.title}
          <ChevronIcon dir={`${open ? 'bottom' : 'left'}`} />
        </span>

        {menu.items.map((item, index) => {
          return (
            <SidebarItem
              key={index}
              title={item.title}
              url={item.link}
              sub_menu={item?.sub_menu}
              className={`${open ? 'block' : 'hidden'}`}
            />
          );
        })}
      </div>
    </li>
  );
};

export default SidebarNav;
