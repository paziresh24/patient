import Link from 'next/link';
import { MenuItem } from './menuItem';
import SidebarNav from './sidebarNav';

const SidebarItem = ({ title, link, sub_menu }: MenuItem) => {
  return (
    <>
      {sub_menu ? (
        <SidebarNav menu={{ title, link, sub_menu }} />
      ) : (
        <li className="px-3 border-b border-dashed border-slate-300">
          <Link prefetch={false} href={link ?? '#'} className="block py-3 font-light" title={title}>
            {title}
          </Link>
        </li>
      )}
    </>
  );
};

export default SidebarItem;
