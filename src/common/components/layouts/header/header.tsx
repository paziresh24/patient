/* eslint-disable @next/next/no-html-link-for-pages */
import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import useResponsive from '@/common/hooks/useResponsive';
import Logo from '@/components/atom/logo';
import ChevronIcon from '@/components/icons/chevron';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import Transition from '../../atom/transition';
import PromoteAppBanner from '../promoteAppBanner';
import MegaMenuContent from './components/megaMenu/megaMenuContent';
import MobileNavbar from './components/mobileNavbar';
import SubMenu from './components/subMenu';
import UserProfile from './components/userProfile';
import { articleMenus, consultMenus, withDoctorMenu, withUserMenu } from './data/links';

enum MegaMenuItem {
  CONSULT = 'consult',
  SPECIALTY = 'specialty',
  ARTICLE = 'article',
}

interface HeaderProps {
  shouldShowBrand?: boolean;
}

const Header = (props: HeaderProps) => {
  const { shouldShowBrand = true } = props;
  const [open, setOpen] = useState(false);
  const { isDesktop } = useResponsive();
  const [menu, setMenu] = useState(MegaMenuItem.SPECIALTY);
  const [expertiseItems, setExpertiseItems] = useState([]);
  const menuItemExpertise = useGetMegaMenu();

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
      <PromoteAppBanner />
      <header className="sticky shadow-card top-0 bg-white text-slate-700 text-lg z-50 px-3 md:px-4 h-16 md:h-20 flex items-center border-b border-solid border-slate-100">
        {isDesktop && (
          <div className="max-w-screen-xl w-full mx-auto relative items-center justify-between hidden md:flex">
            {shouldShowBrand && (
              <a href="/">
                <Logo width={40} height={40} />
              </a>
            )}
            <nav>
              <ul className="flex justify-center">
                <li ref={ref} className="flex items-center" onClick={() => setOpen(true)}>
                  <span className="inline-block text-center cursor-pointer p-3 font-medium text-sm">دسته بندی ها </span>
                  <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />

                  <Transition
                    match={open}
                    animation="bottom"
                    className="shadow-md flex rounded-2xl flex-row mt-1 max-h-[520px] min-h-[496px] p-6 absolute right-0 w-full top-16 bg-white border border-slate-100 z-50"
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
                  </Transition>
                </li>
                <SubMenu title="برای بیماران" menuItem={withUserMenu} />
                <SubMenu title="برای پزشکان" menuItem={withDoctorMenu} />
              </ul>
            </nav>
            <UserProfile />
          </div>
        )}
        {!isDesktop && <MobileNavbar shouldShowBrand={shouldShowBrand} />}
      </header>
    </>
  );
};

export default Header;
