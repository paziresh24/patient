import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import Logo from '@/components/atom/logo';
import ChevronIcon from '@/components/icons/chevron';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import Calender from '../../icons/calender';
import Headphone from '../../icons/headphone';
import Logout from '../../icons/logout';
import UserCircle from '../../icons/userCircle';
import MegaMenuContent from './components/megaMenu/megaMenuContent';
import MobileNavbar from './components/mobileNavbar';
import SubMenu from './components/subMenu';

import { articleMenus, consultMenus, withUserMenu } from './data/links';
enum MegaMenuItem {
  CONSULT = 'consult',
  SPECIALTY = 'specialty',
  ARTICLE = 'article',
}
const Header = () => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(MegaMenuItem.CONSULT);
  const [expertiseItems, setExpertiseItems] = useState([]);
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
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (menuItemExpertise.isSuccess) {
      setExpertiseItems(menuItemExpertise.data.data.result);
    }
  }, [menuItemExpertise.status]);
  return (
    <>
      <header ref={ref} className="bg-white text-slate-700 text-lg z-10  border border-slate-100 hidden md:block">
        <div className="max-w-screen-xl mx-auto relative  flex items-center justify-between">
          <Logo width={40} height={40} />
          <nav className="flex-1">
            <ul className="flex justify-center">
              <li className="flex items-center" onClick={() => setOpen(true)}>
                <span className="inline-block text-center cursor-pointer p-3 text-sm">دسته بندی ها </span>
                <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />
                {open ? (
                  <div className="flex flex-row mt-1 max-h-[520px] min-h-[496px] p-6 absolute right-0 w-full top-16 bg-white border border-slate-100 z-50">
                    <div className="border-l border-slate-200 flex flex-col flex-shrink-0 pl-4 w-44">
                      <a
                        className=" text-sm mb-2 cursor-pointer flex items-center  bg-white border-0 rounded text-slate-700 h-8 outline-none py-0 px-2 text-center "
                        onClick={() => setOpen(false)}
                      >
                        <ChevronIcon dir="right" className="ml-3" />
                        بازگشت
                      </a>
                      <a
                        onMouseOver={() => setMenu(MegaMenuItem.CONSULT)}
                        className={`text-sm mb-2 cursor-pointer flex items-center  ${
                          menu === MegaMenuItem.CONSULT ? 'bg-slate-50' : 'bg-white'
                        } border-0 rounded text-slate-700 h-8 outline-none py-1 px-2 text-center`}
                      >
                        مشاوره انلاین پزشکی
                      </a>
                      <a
                        onMouseOver={() => setMenu(MegaMenuItem.SPECIALTY)}
                        className={`text-sm mb-2 cursor-pointer flex items-center  ${
                          menu === MegaMenuItem.SPECIALTY ? 'bg-slate-50' : 'bg-white'
                        } border-0 rounded text-slate-700 h-8 outline-none py-1 px-2 text-center`}
                      >
                        تخصص ها
                      </a>
                      <a
                        onMouseOver={() => setMenu(MegaMenuItem.ARTICLE)}
                        className={`text-sm mb-2 cursor-pointer flex items-center  ${
                          menu === MegaMenuItem.ARTICLE ? 'bg-slate-50' : 'bg-white'
                        } border-0 rounded text-slate-700 h-8 outline-none py-1 px-2 text-center`}
                      >
                        مجله سلامتی
                      </a>
                    </div>

                    {menu === MegaMenuItem.CONSULT && <MegaMenuContent items={consultMenus} />}
                    {menu === MegaMenuItem.ARTICLE && <MegaMenuContent items={articleMenus} />}
                    {menu === MegaMenuItem.SPECIALTY && <MegaMenuContent items={expertiseItems} />}
                  </div>
                ) : null}
              </li>
              <SubMenu title="برای بیماران" menuItem={withUserMenu} />
              <SubMenu
                title="برای پزشکان"
                menuItem={[
                  {
                    title: 'ورود / ثبت نام پزشکان ',
                  },
                ]}
              />
            </ul>
          </nav>
          <SubMenu title={<UserCircle width="32" height="32" />} menuItem={menuItems} />
        </div>
      </header>
      <MobileNavbar />
    </>
  );
};

export default Header;
