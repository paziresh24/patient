/* eslint-disable @next/next/no-html-link-for-pages */
import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import ChevronIcon from '@/components/icons/chevron';
import SupportButtonBamdad from '@/modules/bamdad/components/suppoortButton';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import HeaderLogo from './components/logo/logo';
import { articleMenus, consultMenus, developersMenu, medicalCenterMenu, withDoctorMenu, withUserMenu } from './data/links';
const ButtonSuggestion = dynamic(() => import('@/modules/search/view/suggestion/button'));
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
  shouldShowPromoteApp?: boolean;
  showSearchSuggestionButton?: boolean;
}

const Header = (props: HeaderProps) => {
  const { shouldShowBrand = true, shouldShowPromoteApp = true, showSearchSuggestionButton } = props;
  const [open, setOpen] = useState(false);
  const { isDesktop } = useResponsive();
  const [menu, setMenu] = useState(MegaMenuItem.CONSULT);
  const [expertiseItems, setExpertiseItems] = useState([]);
  const menuItemExpertise = useGetMegaMenu();
  const { t } = useTranslation('common');
  const customize = useCustomize(state => state.customize);

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
      {!isDesktop && shouldShowPromoteApp && customize.showPromoteApp && <PromoteAppBanner />}
      <header className="z-50 flex items-center min-h-16 h-16 px-3 text-lg bg-white border-b border-solid shadow-sm print:hidden pwa:hidden text-slate-700 md:px-4 md:h-20 border-slate-100">
        <div className="max-w-screen-xl relative items-center justify-between hidden w-full h-full mx-auto md:flex">
          {shouldShowBrand && (
            <div className="flex items-center space-s-4">
              <Link href="/" shallow prefetch={false}>
                <HeaderLogo
                  showPartnerLogo={customize.showPartnerLogoInPrimaryPlace}
                  partnerLogo={customize.partnerLogo}
                  brandType={customize.headerBrandLogoType}
                />
              </Link>
              {customize.showPartnerLogoInPrimaryPlace && <hr className="h-8 border border-dashed rounded-full border-slate-300" />}
              <HeaderLogo
                showPartnerLogo={!customize.showPartnerLogoInPrimaryPlace}
                partnerLogo={customize.partnerLogo}
                brandType={customize.headerBrandLogoType}
              />
            </div>
          )}

          {!!customize.menuNavigation?.length && (
            <nav>
              <ul className="flex justify-center space-s-2">
                {customize.menuNavigation?.map(menu => (
                  <SubMenu
                    key={menu.label}
                    title={menu.label}
                    menuItem={
                      menu.type == 'sub_menu'
                        ? menu.items?.map(item => ({ title: item.label, link: item.link, newTab: item.newTab })) ?? []
                        : [{ title: menu.label, link: menu.link, newTab: menu.newTab }]
                    }
                  />
                ))}
              </ul>
            </nav>
          )}

          {customize.showSideBar && (
            <nav>
              <ul className="flex justify-center space-s-2">
                <li ref={ref}>
                  <div className="flex items-center p-3" onClick={() => setOpen(prev => !prev)}>
                    <span className="inline-block text-sm font-medium text-center cursor-pointer">{t('header.titles.categories')}</span>
                    <ChevronIcon className="mr-3" dir={`${open ? 'top' : 'bottom'}`} />
                  </div>

                  <Transition
                    match={open}
                    animation="bottom"
                    className="w-full shadow-md flex rounded-2xl flex-row mt-1 max-h-[520px] min-h-[496px] p-6 absolute right-0 top-16 bg-white border border-slate-200 z-50"
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
                    {menu === MegaMenuItem.CONSULT && <MegaMenuContent items={consultMenus} onClose={() => setOpen(prev => !prev)} />}
                    {menu === MegaMenuItem.ARTICLE && <MegaMenuContent items={articleMenus} onClose={() => setOpen(prev => !prev)} />}
                    {menu === MegaMenuItem.SPECIALTY && <MegaMenuContent items={expertiseItems} onClose={() => setOpen(prev => !prev)} />}
                  </Transition>
                </li>
                <SubMenu title={t('header.titles.forPatients')} menuItem={withUserMenu} />
                <SubMenu menuItem={withDoctorMenu} />
                <SubMenu title={t('header.titles.medicalCenters')} menuItem={medicalCenterMenu} />
                <SubMenu title={t('header.titles.developers')} menuItem={developersMenu} />
              </ul>
            </nav>
          )}
          <div className="flex items-center space-s-4">
            <SupportButtonBamdad />
            {showSearchSuggestionButton && <ButtonSuggestion />}
            {customize.showUserProfile && <UserProfile />}
          </div>
        </div>
        <MobileNavbar showSearchSuggestionButton={showSearchSuggestionButton} shouldShowBrand={shouldShowBrand} />
      </header>
    </>
  );
};

export default Header;
