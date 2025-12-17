import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

type FragmentEntry = {
  Component: ComponentType<any>;
  id: string;
  projectId?: string;
};

type LoaderConfig = {
  dynamicImport: () => Promise<any>;
  id: string;
  projectId?: string;
};

const createComponentLoader = ({ dynamicImport, id, projectId }: LoaderConfig) => {
  const Component = dynamic(dynamicImport);
  return () => ({
    Component,
    id,
    projectId,
  });
};

const componentLoaders: Record<string, () => FragmentEntry> = {
  Claim: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'),
    id: '5jjwlzFYfMqI',
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  }),
  ReviewList2: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewList2'),
    id: 'Kz2u6VAJ02yE',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  RateAndCommentCount2: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndCommentCount'),
    id: 'etOCIhcu_Yx5',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  RateProgressList: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewProgressList'),
    id: 'xpGRRNKB86D2',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  RateAndReviews: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndReviews'),
    id: 'qb59XTke1gWO',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  ReviewList: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewList'),
    id: 'Bx6gxTOoja9k',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  RateAndCommentCount: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicRateAndCommentCount'),
    id: 'u3Jgb_UfiULc',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  RateProgressBar: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/ravi_r_r/PlasmicRateProgressBar'),
    id: 'YorKPsj5-KCA',
    projectId: 'qQzsBf58SqzNJX45iggq96',
  }),
  ReceiptActionButtons: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons'),
    id: 'EifS7TB9I3zC',
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  }),
  Services: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24/PlasmicServices'),
    id: 'q3FGMz6XNu9L',
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  }),
  Activity: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24/PlasmicActivity'),
    id: 'pggD1apWa_wW',
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  }),
  About: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24/PlasmicAbout'),
    id: '6mjf324FkOZF',
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  }),
  LocationSelectionScript: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript'),
    id: '5bzKtjF_q24p',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  ProductCard: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicProductCard'),
    id: 'NhMGML-3Q4Pu',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  SearchResults: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicSearchResults'),
    id: 'XhSI4pxMLR3L',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  Schedules: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingSchedules'),
    id: 'Mt_WMP6AHSGv',
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  }),
  SearchRequest: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicSearchRequest'),
    id: '35vwUOYdUX87',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  AddressesWrapper: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingAddressesWrapper'),
    id: 'Z7E4nvI5-Dtv',
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  }),
  AddressesCard: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingAddressesCard'),
    id: 'z1k0-vbkFtby',
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  }),
  BookingServiceList: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingServiceList'),
    id: 'fpdRSzutXHoq',
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  }),
  ProfileHead: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileHead'),
    id: 'fKBGdItR62E2',
    projectId: '7r312uiqyadpVPdnRoAggk',
  }),
  ProfileAbout: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileAbout'),
    id: 'VlJvd0AHTT9_',
    projectId: '7r312uiqyadpVPdnRoAggk',
  }),
  ProfileActivity: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileActivity'),
    id: 'LIHtK_X7GpDY',
    projectId: '7r312uiqyadpVPdnRoAggk',
  }),
  ProfileSeo: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileSeo'),
    id: 'AyZkzO0Ld0SI',
    projectId: '7r312uiqyadpVPdnRoAggk',
  }),
  ProfileGallery: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileGallery'),
    id: '-M0f8W0T-8eT',
    projectId: '7r312uiqyadpVPdnRoAggk',
  }),
  FilterListView: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterListView'),
    id: 'Z5K_XiJUvXFD',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  FilterExpertiseView: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterExpertiseView'),
    id: 'N8MUho5TZvBe',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  FilterSelectedView: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterSelectedView'),
    id: 'hzanYC1FO-Wr',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  FilterRow: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterRow'),
    id: 'OC23iWRW1Dia',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  HomePageShortcuts: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicHomePageShortcuts'),
    id: 'pfHDjmK7Jo_j',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  OnlineVisit: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicOnlineVisit'),
    id: 'kiuZ6fZVjKcZ',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  SearchInput: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicSearch'),
    id: 'd_qMEJ14UZf0',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  RecentSearch: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicRecentSearch'),
    id: 'ARWFU9130hug',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  SeoBox: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicSeoBox'),
    id: 'LCOgDdMa8kxO',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  Sort: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicSort'),
    id: 's-wlX7BnSeTl',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  ConsultBanner: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicConsultBanner'),
    id: 'KmDr0VPQLI2_',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  ResultView: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/paziresh_24_search/PlasmicResultView'),
    id: 'NYqLbXm7Qk5C',
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  }),
  Risman: createComponentLoader({
    dynamicImport: () => import('.plasmic/plasmic/risman/PlasmicRisman'),
    id: 'KinPlL1Jj1j3',
    projectId: 'bN5uNsAhTefwW3S14VjvMG',
  }),
};

const Components: Record<string, FragmentEntry> = {};

export const getComponentLoader = (name: string) => componentLoaders[name];

export { Components };

