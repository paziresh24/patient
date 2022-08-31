import ChevronIcon from '@/common/components/icons/chevron';
import { useState } from 'react';
import SidebarItem from './SidebarItem';

interface SidebarNavProps {
  menu: {
    title: string;
    items: {
      title: string;
      url: string;
    }[];
  };
}
const SidebarNav = ({ menu }: SidebarNavProps) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="max-h-96 overflow-auto border-b border-slate-100">
      <div className="relative">
        <span onClick={() => setOpen(!open)} className=" sticky top-0 bg-white  py-6 px-3 text-sm flex items-center justify-between">
          {menu.title}
          <ChevronIcon dir={`${open ? 'bottom' : 'left'}`} />
        </span>
        {menu.items.map((item, index) => {
          return <SidebarItem key={index} title={item.title} url={item.title} className={`${open ? 'block' : 'hidden'}`} />;
        })}
      </div>
    </li>
  );
};

export default SidebarNav;
