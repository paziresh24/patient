import ChevronIcon from '@/common/components/icons/chevron';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

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
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (open) {
      setOpen(false);
    }
  });

  return (
    <>
      {sub_menu ? (
        <ul className={`font-semibold mb-3 overflow-y-scroll ${className}`}>
          <li className="overflow-auto border-b max-h-96 border-slate-100">
            <div className="relative">
              <span
                ref={ref}
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center justify-between px-3 py-6 text-sm bg-white"
              >
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
            <a href={url} className="block px-5 py-3" title={title}>
              {title}
            </a>
          </li>
        </ul>
      )}
    </>
  );
};

export default SidebarItem;
