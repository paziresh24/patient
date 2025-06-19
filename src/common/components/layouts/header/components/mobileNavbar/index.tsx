/* eslint-disable @next/next/no-html-link-for-pages */
import { useGetMegaMenu } from '@/common/apis/services/general/getMegaMenu';
import HumbuggerMenu from '@/common/components/icons/humbuggerMenu';
import useCustomize from '@/common/hooks/useCustomize';
import SupportButtonBamdad from '@/modules/bamdad/components/suppoortButton';
import ButtonSuggestion from '@/modules/search/view/suggestion/button';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { articleMenus, consultMenus, developersMenu, medicalCenterMenu, withDoctorMenu, withUserMenu } from '../../data/links';
import HeaderLogo from '../logo/logo';
import UserProfile from '../userProfile';
const Sidebar = dynamic(() => import('./sidebar'));

interface MobileNavbarProps {
  shouldShowBrand?: boolean;
  showSearchSuggestionButton?: boolean;
}
const MobileNavbar = (props: MobileNavbarProps) => {
  const { shouldShowBrand = true, showSearchSuggestionButton = false } = props;
  const [open, setOpen] = useState(false);
  const [expertiseItems, setExpertiseItems] = useState([]);
  const ref = useRef(null);
  const menuItemExpertise = useGetMegaMenu();
  const customize = useCustomize(state => state.customize);

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
      title: 'مجله سلامتی',
      sub_menu: articleMenus,
    },
    {
      id: 4,
      title: 'برای بیماران',
      sub_menu: withUserMenu,
    },
    {
      id: 5,
      title: 'برای پزشکان',
      sub_menu: withDoctorMenu,
    },
    {
      id: 6,
      title: 'مراکز درمانی',
      sub_menu: medicalCenterMenu,
    },
    {
      id: 7,
      title: 'توسعه دهندگان',
      sub_menu: developersMenu,
    },
    {
      id: 8,
      title: 'پشتیبانی',
      sub_menu: [
        {
          title: 'پشتیبانی',
          link: 'https://support.paziresh24.com',
        },
      ],
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
    <div ref={ref} className="block w-full text-sm z-infinity md:hidden">
      <div className="relative flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex flex-row items-center gap-2">
          {(customize.showSideBar || !!customize.menuNavigation?.length) && (
            <div className="flex items-center justify-center w-8 h-8" onClick={() => setOpen(true)}>
              <HumbuggerMenu />
            </div>
          )}
          {shouldShowBrand && (
            <Link href="/" shallow prefetch={false}>
              <HeaderLogo
                showPartnerLogo={customize.showPartnerLogoInPrimaryPlace}
                partnerLogo={customize.partnerLogo}
                brandType={customize.headerBrandLogoType}
                size="mobile"
              />
            </Link>
          )}
          {customize.showPartnerLogoInPrimaryPlace && <hr className="h-8 border border-dashed rounded-full border-slate-300" />}
          <HeaderLogo
            showPartnerLogo={!customize.showPartnerLogoInPrimaryPlace}
            partnerLogo={customize.partnerLogo}
            brandType={customize.headerBrandLogoType}
            size="mobile"
          />
        </div>

        <div className="flex items-center space-s-3">
          <SupportButtonBamdad />
          {showSearchSuggestionButton && <ButtonSuggestion />}
          {customize.showUserProfile && <UserProfile />}
        </div>
        <Sidebar
          menus={
            customize.menuNavigation?.length
              ? customize.menuNavigation?.map((menu, index) => ({
                  id: index,
                  title: menu.label,
                  sub_menu:
                    menu.type == 'sub_menu'
                      ? menu.items?.map(item => ({ title: item.label, link: item.link, newTab: item.newTab })) ?? []
                      : [{ title: menu.label, link: menu.link, newTab: menu.newTab }],
                }))
              : sidebarMenu
          }
          closeSidebar={() => setOpen(false)}
          isOpen={open}
        />
      </div>
    </div>
  );
};

export default MobileNavbar;
