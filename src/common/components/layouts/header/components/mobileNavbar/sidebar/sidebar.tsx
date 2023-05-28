import Logo from '@/common/components/atom/logo';
import ChevronIcon from '@/common/components/icons/chevron';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import BackDrop from './backdrop';
import { MenuItem } from './menuItem';
import SidebarNav from './sidebarNav';
const Transition = dynamic(() => import('@/common/components/atom/transition'));

interface SidebarProps {
  closeSidebar: () => void;
  isOpen: boolean;
  menus: Array<
    MenuItem & {
      id: number;
    }
  >;
}
const Sidebar = ({ menus, closeSidebar, isOpen }: SidebarProps) => {
  useEffect(() => {
    if (isOpen) {
      return document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  return (
    <>
      <Transition match={isOpen} animation="fade" className="absolute">
        <BackDrop action={closeSidebar} />
      </Transition>

      <Transition
        match={isOpen}
        duration={300}
        animation="left"
        delay={300}
        className="fixed top-0 left-[20%] right-0 bottom-0 flex flex-col bg-white text-slate-700 text-sm font-medium z-50 p-6"
      >
        <div className="w-full border-b border-slate-200">
          <button
            onClick={closeSidebar}
            className="flex items-center justify-center px-0 py-3 text-sm bg-transparent border-none cursor-pointer"
          >
            <ChevronIcon dir="right" className="ml-2" /> بازگشت
          </button>
        </div>
        <ul>
          {menus.map(menu => (
            <SidebarNav key={menu.id} menu={menu} />
          ))}
        </ul>
        <div className="absolute bottom-0 right-0 z-50 flex items-center justify-center w-full h-24 bg-white">
          <Logo fontSize="sm" width={42} height={42} />
        </div>
      </Transition>
    </>
  );
};

export default Sidebar;
