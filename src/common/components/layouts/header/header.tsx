import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import useResponsive from '@/common/hooks/useResponsive';
import Logo from '@/components/atom/logo';
import ChevronIcon from '@/components/icons/chevron';
import { useLoginModalContext } from '@/modules/login/context/modalLogin';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import Button from '../../atom/button';
import Skeleton from '../../atom/skeleton';
import Text from '../../atom/text';
import Calender from '../../icons/calender';
import Headphone from '../../icons/headphone';
import Logout from '../../icons/logout';
import { UserCircle } from '../../icons/userCircle';
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
  const { openLoginModal } = useLoginModalContext();
  const { isLogin, userInfo, pending } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
    pending: state.pending,
  }));
  const { isDesktop } = useResponsive();
  const [menu, setMenu] = useState(MegaMenuItem.SPECIALTY);
  const [expertiseItems, setExpertiseItems] = useState([]);
  const menuItemExpertise = useGetMegaMenu();
  const menuItems = [
    {
      id: 0,
      title: 'نوبت های من',
      link: '/appointments',
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

  const handleLogin = () => {
    openLoginModal({
      state: true,
    });
  };

  return (
    <>
      <header className="bg-white text-slate-700 text-lg z-50 px-4 h-20 flex items-center border-b border-solid border-slate-100">
        {isDesktop && (
          <div className="max-w-screen-xl w-full mx-auto relative items-center justify-between flex ">
            <Link href="/">
              <a>
                <Logo width={40} height={40} />
              </a>
            </Link>
            <nav className="flex-1">
              <ul className="flex justify-center">
                <li ref={ref} className="flex items-center" onClick={() => setOpen(true)}>
                  <span className="inline-block text-center cursor-pointer p-3 font-medium text-sm">دسته بندی ها </span>
                  <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />

                  <div
                    className={`shadow-md rounded-2xl flex-row mt-1 max-h-[520px] min-h-[496px] p-6 absolute right-0 w-full top-16 bg-white border border-slate-100 z-50 ${
                      open ? 'flex' : 'hidden'
                    }`}
                  >
                    <div className="border-l border-slate-200 flex flex-col flex-shrink-0 pl-4 w-44">
                      <a
                        onMouseOver={() => setMenu(MegaMenuItem.CONSULT)}
                        className={`text-sm mb-2 cursor-pointer font-medium flex items-center  ${
                          menu === MegaMenuItem.CONSULT ? 'bg-slate-100' : 'bg-white'
                        } border-0 rounded text-slate-700 h-8 outline-none py-1 px-2 text-center`}
                      >
                        مشاوره آنلاین پزشکی
                      </a>
                      <a
                        onMouseOver={() => setMenu(MegaMenuItem.SPECIALTY)}
                        className={`text-sm mb-2 cursor-pointer font-medium flex items-center  ${
                          menu === MegaMenuItem.SPECIALTY ? 'bg-slate-100' : 'bg-white'
                        } border-0 rounded text-slate-700 h-8 outline-none py-1 px-2 text-center`}
                      >
                        تخصص ها
                      </a>
                      <a
                        onMouseOver={() => setMenu(MegaMenuItem.ARTICLE)}
                        className={`text-sm mb-2 cursor-pointer font-medium flex items-center  ${
                          menu === MegaMenuItem.ARTICLE ? 'bg-slate-100' : 'bg-white'
                        } border-0 rounded text-slate-700 h-8 outline-none py-1 px-2 text-center`}
                      >
                        مجله سلامتی
                      </a>
                    </div>

                    {menu === MegaMenuItem.CONSULT && <MegaMenuContent items={consultMenus} />}
                    {menu === MegaMenuItem.ARTICLE && <MegaMenuContent items={articleMenus} />}
                    {menu === MegaMenuItem.SPECIALTY && <MegaMenuContent items={expertiseItems} />}
                  </div>
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

            {pending && <Skeleton w="8rem" h="2.5rem" rounded="md" />}
            {!pending &&
              (isLogin ? (
                <SubMenu
                  title={
                    <>
                      <UserCircle width="30" height="30" />
                      <Text fontWeight="bold">{userInfo.name + ' ' + userInfo.family}</Text>
                    </>
                  }
                  menuItem={menuItems}
                  hasIcon
                />
              ) : (
                <Button className="!px-4" size="sm" variant="secondary" onClick={handleLogin}>
                  ورود / ثبت‌نام
                </Button>
              ))}
          </div>
        )}
        {!isDesktop && <MobileNavbar menuItems={menuItems} />}
      </header>
    </>
  );
};

export default Header;
