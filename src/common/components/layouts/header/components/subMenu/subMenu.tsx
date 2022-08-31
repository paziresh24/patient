import ChevronIcon from '@/common/components/icons/chevron';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
interface Item {
  title: React.ReactNode;
  icon?: React.ReactNode;
}
interface SubMenuProps {
  title: React.ReactNode;
  className?: '';
  menuItem: Item[];
}

const SubMenu = ({ title, menuItem, className }: SubMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });
  return (
    <li ref={ref} className="relative  flex items-center" onClick={() => setOpen(!open)}>
      <span className="inline-block text-center cursor-pointer p-3 text-sm md:p-6 ">{title}</span>
      <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />
      {open ? (
        <ul className="absolute  left-[50%] ml-10 min-w-full text-slate-700 font-medium whitespace-nowrap z-50 py-3 px-0 overflow-auto bg-white border border-slate-300 rounded-2xl max-w-xs w-max  top-16 -translate-x-1/2 md:ml-0">
          {menuItem.map((item, index) => {
            return (
              <li key={index} className="flex items-center">
                <span className="mr-2">{item.icon && item.icon}</span>
                <a className="block py-3 px-6 text-sm cursor-pointer">{item.title} </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
};

export default SubMenu;
