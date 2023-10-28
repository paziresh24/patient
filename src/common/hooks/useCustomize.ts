import { create } from 'zustand';

export interface ThemeConfig {
  partnerKey: string;
  showHeader: boolean;
  showFooter: boolean;
  showSideBar: boolean;
  headerBrandLogoType: HeaderBrandLogoType;
  showUserProfile: boolean;
  showBrandLogoInHomePage: boolean;
  showPromoteApp: boolean;
  partnerLogo: string;
  showPartnerLogoInPrimaryPlace: boolean;
  partnerTitle: string;
  partnerSubTitle: string;
  showSelectCityInSuggestion: boolean;
  showSeoBoxs: boolean;
  footerType: FooterType;
  showConsultServices: boolean;
  showActivityProfile: boolean;
  showGalleryProfile: boolean;
  showTermsAndConditions: boolean;
  bookMark: boolean;
  showShareApp: boolean;
  showSupplierRegister: boolean;
  showRateAndReviews: boolean;
  showSupport: boolean;
  showContribute: boolean;
}

type Layout = 'default' | 'no-sidebar' | 'basic';
type HeaderBrandLogoType = 'default' | 'compact';
type FooterType = 'default' | 'compact';
type Toggle = 'on' | 'off';

const useCustomize = create<{ customize: Partial<ThemeConfig>; setCustomize: (query: any) => void }>(set => ({
  customize: {
    showHeader: true,
    showFooter: true,
    footerType: 'default',
    showPromoteApp: true,
    showUserProfile: true,
    showSideBar: true,
    showSeoBoxs: true,
    showSelectCityInSuggestion: true,
    headerBrandLogoType: 'default',
    partnerLogo: '',
    partnerSubTitle: '',
    partnerTitle: '',
    showBrandLogoInHomePage: false,
    showPartnerLogoInPrimaryPlace: false,
    showConsultServices: true,
    showActivityProfile: true,
    showGalleryProfile: true,
    showTermsAndConditions: true,
    bookMark: true,
    showShareApp: true,
    showSupplierRegister: true,
    showRateAndReviews: true,
    showSupport: true,
    showContribute: true,
  },
  setCustomize: (query: any) => {
    if (!query) return;

    return set(state => ({
      ...state,
      customize: {
        ...state.customize,
        ...query,
      },
    }));
  },
}));

export default useCustomize;
