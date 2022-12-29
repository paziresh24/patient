import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import create from 'zustand';

interface returnData {
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
}

type Layout = 'default' | 'no-sidebar' | 'basic';
type HeaderBrandLogoType = 'default' | 'compact';
type FooterType = 'default' | 'compact';
type Toggle = 'on' | 'off';

const useCustomizeStore = create<{ costomize: Partial<returnData>; setCostomize: (data: returnData) => void }>(set => ({
  costomize: {},
  setCostomize: costomize =>
    set(state => ({
      ...state,
      costomize,
    })),
}));

export const useCustomize = (): returnData => {
  const { query } = useRouter();
  const { costomize, setCostomize } = useCustomizeStore();

  if (isEmpty(costomize))
    setCostomize({
      showSideBar: (query.layout as Layout) !== 'no-sidebar' && (query.layout as Layout) !== 'basic',
      headerBrandLogoType: (query['header:brand-logo-type'] as HeaderBrandLogoType) ?? 'default',
      showUserProfile: (query['header:user-profile'] as Toggle) !== 'off',
      showBrandLogoInHomePage: (query['header:brand-logo-in-home-page'] as Toggle) === 'on' || false,
      showPromoteApp: (query['promote-app'] as Toggle) !== 'off',
      partnerLogo: query['partner:logo'] as string,
      showPartnerLogoInPrimaryPlace: (query['partner:primary-place'] as Toggle) === 'on',
      partnerTitle: query['partner:title'] as string,
      partnerSubTitle: query['partner:sub-title'] as string,
      showSelectCityInSuggestion: (query['suggestion:city-select'] as Toggle) !== 'off',
      showSeoBoxs: (query['seo:show'] as Toggle) !== 'off' && !query.isWebView,
      footerType: (query['footer:type'] as FooterType) ?? 'default',
    });

  return costomize as returnData;
};

export default useCustomize;
