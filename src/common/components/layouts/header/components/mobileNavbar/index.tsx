import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import Logo from '@/common/components/atom/logo';
import HumbuggerMenu from '@/common/components/icons/humbuggerMenu';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { articleMenus, consultMenus, withDoctorMenu, withUserMenu } from '../../data/links';
import UserProfile from '../userProfile';
import Sidebar from './sidebar';
import BackDrop from './sidebar/backdrop';

const MobileNavbar = () => {
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
    <div ref={ref} className="text-sm block w-full lg:hidden">
      {open && (
        <BackDrop
          action={() => {
            setOpen(false);
          }}
        />
      )}
      <div className="max-w-screen-xl mx-auto relative  flex items-center justify-between p-2 ">
        <div className="flex flex-row items-center gap-2" onClick={() => setOpen(true)}>
          <HumbuggerMenu />
          <Logo fontSize="sm" width={32} height={32} />
        </div>
        <UserProfile />
        <Sidebar menus={sidebarMenu} closeSidebar={() => setOpen(false)} className={`${open ? 'block' : 'hidden'}`} />
      </div>
    </div>
  );
};

export default MobileNavbar;
