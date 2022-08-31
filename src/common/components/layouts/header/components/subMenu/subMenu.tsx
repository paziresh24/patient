import ChevronIcon from '@/common/components/icons/chevron';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
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
      <span className="inline-block text-center cursor-pointer p-3 text-sm md:p-6 font-medium">{title}</span>
      {hasIcon && <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />}
      <ul
        className={`absolute shadow-md left-[50%] ml-10 min-w-full text-slate-700 font-medium whitespace-nowrap z-50 py-3 px-2 overflow-auto bg-white border border-slate-300 rounded-2xl max-w-xs w-max  top-16 -translate-x-1/2 md:ml-0 ${
          open ? 'block' : 'hidden'
        }`}
      >
        {menuItem.map((item, index) => {
          return (
            <li key={index} className="flex items-center">
              {item.icon && <span className="pr-3">{item.icon}</span>}
              <a href={item.link} className="block py-3 px-3 text-sm cursor-pointer">
                {item.title}{' '}
              </a>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default SubMenu;
