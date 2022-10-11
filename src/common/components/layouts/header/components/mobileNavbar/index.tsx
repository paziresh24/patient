/* eslint-disable @next/next/no-html-link-for-pages */
import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import Logo from '@/common/components/atom/logo';
import HumbuggerMenu from '@/common/components/icons/humbuggerMenu';
import dynamic from 'next/dynamic';
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
      items: consultMenus,
    },
    {
      id: 2,
      title: 'تخصص ها',
      items: expertiseItems,
    },

    {
      id: 3,
      title: 'برای بیماران',
      items: withUserMenu,
    },
    {
      id: 4,
      title: 'برای پزشکان',
      items: withDoctorMenu,
    },
    {
      id: 5,
      title: 'مجله سلامتی',
      items: articleMenus,
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
    <div ref={ref} className="text-sm block w-full z-50 lg:hidden">
      <div className="max-w-screen-xl mx-auto relative flex items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="w-8 h-8 flex justify-center items-center" onClick={() => setOpen(true)}>
            <HumbuggerMenu />
          </div>
          {shouldShowBrand && (
            <a href="/">
              <Logo fontSize="sm" width={32} height={32} />
            </a>
          )}
        </div>
        <UserProfile />
        <Sidebar menus={sidebarMenu} closeSidebar={() => setOpen(false)} isOpen={open} />
      </div>
    </div>
  );
};

export default MobileNavbar;
