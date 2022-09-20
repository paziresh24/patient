import Logo from '@/common/components/atom/logo';
import Transition from '@/common/components/atom/transition';
import ChevronIcon from '@/common/components/icons/chevron';
import BackDrop from './backdrop';
import SidebarNav from './SidebarNav';

interface SidebarProps {
  closeSidebar: () => void;
  isOpen: boolean;
  menus: {
    id: number;
    title: string;
    items: {
      title: string;
      link: string;
    }[];
  }[];
}
const Sidebar = ({ menus, closeSidebar, isOpen }: SidebarProps) => {
  return (
    <>
      <Transition match={isOpen} duration={300} animation="fade" className="absolute">
        <BackDrop action={closeSidebar} />
      </Transition>

      <Transition
        match={isOpen}
        duration={400}
        animation="left"
        className="fixed top-0 left-[20%] right-0 bottom-0 flex flex-col bg-white text-slate-700 text-sm font-medium z-50 p-6"
      >
        <div className="w-full border-b border-slate-100">
          <button
            onClick={closeSidebar}
            className="py-6 text-sm px-0 flex items-center justify-center cursor-pointer bg-transparent border-none"
          >
            <ChevronIcon dir="right" className="ml-2" /> بازگشت
          </button>
        </div>
        <ul>
          {menus.map(menu => {
            return <SidebarNav key={menu.id} menu={menu} />;
          })}
        </ul>
        <div className="absolute bottom-7 left-2/4 -translate-x-1/2 ">
          <Logo fontSize="sm" width={42} height={42} />
        </div>
      </Transition>
    </>
  );
};

export default Sidebar;
