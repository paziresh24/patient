import ChevronIcon from '@/common/components/icons/chevron';
import { useState } from 'react';

interface SidebarItemProps {
  title: string;
  url: string;
  sub_menu?: {
    title: string;
    link: string;
  }[];
  className?: string;
}
const SidebarItem = ({ title, url, sub_menu, className }: SidebarItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {sub_menu ? (
        <ul className={`font-normal mb-3 overflow-y-scroll ${className}`}>
          <li className="max-h-96 overflow-auto border-b border-slate-100">
            <div className="relative">
              <span onClick={() => setOpen(!open)} className="bg-white  py-6 px-3 text-sm flex items-center justify-between">
                {title}
                <ChevronIcon dir={`${open ? 'bottom' : 'left'}`} />
              </span>
              {sub_menu.map((item, index) => {
                return <SidebarItem key={index} title={item.title} url={item.link} className={`${open ? 'block' : 'hidden'}`} />;
              })}
            </div>
          </li>
        </ul>
      ) : (
        <ul className={`font-normal mb-3 overflow-y-scroll ${className}`}>
          <li>
            <a href={url} className="block py-3 px-5" title={title}>
              {title}
            </a>
          </li>
        </ul>
      )}
    </>
  );
};

export default SidebarItem;
