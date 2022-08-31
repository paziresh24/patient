import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import Calender from '@/common/components/icons/calender';
import Headphone from '@/common/components/icons/headphone';
import Logout from '@/common/components/icons/logout';
import UserCircle from '@/common/components/icons/userCircle';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { articleMenus, consultMenus, withUserMenu } from '../../data/links';
import SubMenu from '../subMenu';
import Sidebar from './sidebar';

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const [expertiseItems, setExpertiseItems] = useState([]);
  const ref = useRef(null);
  const menuItemExpertise = useGetMegaMenu();

  const menuItems = [
    {
      id: 0,
      title: 'نوبت های من',
      icon: <Calender />,
    },
    {
      id: 1,
      title: 'پشتیبانی',
      icon: <Headphone />,
    },
    {
      id: 2,
      title: 'خروج',
      icon: <Logout />,
    },
  ];
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
      items: [
        {
          title: 'ورود / ثبت نام پزشکان',
          url: 'https://dr.paziresh24.com/auth?utm_source=home&amp;utm_medium=click&amp;utm_campaign=login-register-auth',
        },
      ],
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
    <header ref={ref} className="text-slate-700 bg-white text-sm z-50  border border-slate-200 block md:hidden">
      <div className="max-w-screen-xl mx-auto relative  flex items-center justify-between p-2 ">
        <div onClick={() => setOpen(true)}>
          <svg
            data-v-88a7ab22=""
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="toggle menu-toggler"
          >
            <title data-v-88a7ab22="">icon</title>{' '}
            <path
              data-v-88a7ab22=""
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <SubMenu title={<UserCircle width="32" height="32" />} menuItem={menuItems} />
        {open && (
          <>
            <Sidebar menus={sidebarMenu} closeSidebar={() => setOpen(false)} />
          </>
        )}
      </div>
    </header>
  );
};

export default MobileNavbar;
