/* eslint-disable @next/next/no-html-link-for-pages */
import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import Logo from '@/common/components/atom/logo';
import HumbuggerMenu from '@/common/components/icons/humbuggerMenu';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { articleMenus, consultMenus, withDoctorMenu, withUserMenu } from '../../data/links';
import UserProfile from '../userProfile';
const Sidebar = dynamic(() => import('./sidebar'));

interface MobileNavbarProps {
  shouldShowBrand?: boolean;
}
const MobileNavbar = (props: MobileNavbarProps) => {
  const { shouldShowBrand = true } = props;
  const [open, setOpen] = useState(false);
  const [expertiseItems, setExpertiseItems] = useState([]);
  const ref = useRef(null);
  const menuItemExpertise = useGetMegaMenu();

  const sidebarMenu = [
    {
      id: 1,
      title: 'مشاوره آنلاین پزشکی',
      sub_menu: consultMenus,
    },
    {
      id: 2,
      title: 'تخصص ها',
      sub_menu: expertiseItems,
    },

    {
      id: 3,
      title: 'برای بیماران',
      sub_menu: withUserMenu,
    },
    {
      id: 4,
      title: 'برای پزشکان',
      sub_menu: withDoctorMenu,
    },
    {
      id: 5,
      title: 'مجله سلامتی',
      sub_menu: articleMenus,
    },
  ];

  useClickAway(ref, () => {
    setOpen(false);
  });
  useEffect(() => {
    if (menuItemExpertise.isSuccess) {
      setExpertiseItems(menuItemExpertise.data.data.result);
    }
  }, [menuItemExpertise.status]);
  return (
    <div ref={ref} className="z-50 block w-full text-sm lg:hidden">
      <div className="relative flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex flex-row items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8" onClick={() => setOpen(true)}>
            <HumbuggerMenu />
          </div>
          {shouldShowBrand && (
            <Link href="/" shallow>
              <a>
                <Logo fontSize="sm" width={32} height={32} />
              </a>
            </Link>
          )}
        </div>
        <UserProfile />
        <Sidebar menus={sidebarMenu} closeSidebar={() => setOpen(false)} isOpen={open} />
      </div>
    </div>
  );
};

export default MobileNavbar;
