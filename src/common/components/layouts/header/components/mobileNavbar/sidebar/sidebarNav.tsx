import ChevronIcon from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { MenuItem } from './menuItem';
import SidebarItem from './sidebarItem';

const SidebarNav = ({ menu }: { menu: MenuItem }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(
    ref,
    () => {
      if (open) {
        setOpen(false);
      }
    },
    ['click'],
  );

  return (
    <li className="border-b border-slate-200" ref={ref}>
      <div onClick={() => setOpen(prev => !prev)} className="flex items-center justify-between px-3 py-3 text-sm cursor-pointer">
        {menu.title}
        <ChevronIcon dir={`${open ? 'bottom' : 'left'}`} />
      </div>

      {menu?.sub_menu && open && (
        <ul className={classNames('font-normal overflow-auto max-h-64')}>
          {menu.sub_menu.map((item, index) => {
            return <SidebarItem key={index} title={item.title} link={item.link} sub_menu={item?.sub_menu} />;
          })}
        </ul>
      )}
    </li>
  );
};

export default SidebarNav;
