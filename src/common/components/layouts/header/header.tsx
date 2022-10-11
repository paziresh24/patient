/* eslint-disable @next/next/no-html-link-for-pages */
import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import useResponsive from '@/common/hooks/useResponsive';
import Logo from '@/components/atom/logo';
import ChevronIcon from '@/components/icons/chevron';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { articleMenus, consultMenus, withDoctorMenu, withUserMenu } from './data/links';
const Transition = dynamic(() => import('../../atom/transition'));
const MobileNavbar = dynamic(() => import('./components/mobileNavbar'));
const MegaMenuContent = dynamic(() => import('./components/megaMenu/megaMenuContent'));
const SubMenu = dynamic(() => import('./components/subMenu'));
const UserProfile = dynamic(() => import('./components/userProfile'));
const PromoteAppBanner = dynamic(() => import('../promoteAppBanner'));

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
  const { t } = useTranslation('common');

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
      {!isDesktop && <PromoteAppBanner />}
      <header className="z-50 flex items-center h-16 px-3 text-lg bg-white border-b border-solid md:shadow-card text-slate-700 md:px-4 md:h-20 border-slate-100">
        {isDesktop && (
          <div className="relative items-center justify-between hidden w-full max-w-screen-xl mx-auto md:flex">
            {shouldShowBrand && (
              <a href="/">
                <Logo width={40} height={40} />
              </a>
            )}
            <nav>
              <ul className="flex justify-center">
                <li ref={ref} className="flex items-center" onClick={() => setOpen(true)}>
                  <span className="inline-block p-3 text-sm font-medium text-center cursor-pointer">{t('header.titles.categories')}</span>
                  <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />

                  <Transition
                    match={open}
                    animation="bottom"
                    className="shadow-md flex rounded-2xl flex-row mt-1 max-h-[520px] min-h-[496px] p-6 absolute right-0 w-full top-16 bg-white border border-slate-100 z-50"
                  >
                    <div className="flex flex-col flex-shrink-0 pl-4 border-l border-slate-200 w-44">
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
                <SubMenu title={t('header.titles.forPatients')} menuItem={withUserMenu} />
                <SubMenu title={t('header.titles.forDoctors')} menuItem={withDoctorMenu} />
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
