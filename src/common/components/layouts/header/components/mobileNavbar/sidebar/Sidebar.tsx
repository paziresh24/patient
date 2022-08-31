import Logo from '@/common/components/atom/logo';
import ChevronIcon from '@/common/components/icons/chevron';
import SidebarNav from './SidebarNav';

interface SidebarProps {
  closeSidebar: () => void;
  className?: string;
  menus: {
    id: number;
    title: string;
    items: {
      title: string;
      url: string;
    }[];
  }[];
}
const Sidebar = ({ menus, closeSidebar, className }: SidebarProps) => {
  return (
    <div
      className={`fixed top-0 left-[20%] right-0 bottom-0 flex flex-col bg-white text-slate-700 text-sm font-medium z-50  p-6 ${className}`}
    >
      <div className="w-full border-b border-slate-100">
        <button
          onClick={() => closeSidebar()}
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
      <div className="absolute bottom-3 left-2/4 -translate-x-1/2">
        <Logo fontSize="lg" />
      </div>
    </div>
  );
};

export default Sidebar;
