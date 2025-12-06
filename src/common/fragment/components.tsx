import dynamic from 'next/dynamic';
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const PlasmicReviewList2 = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewList2'));
const PlasmicReviewRateAndCommentCount = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndCommentCount'));
const PlasmicProgressList = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewProgressList'));
const PlasmicReviewRateAndReviews = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndReviews'));
const PlasmicReviewList = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewList'));
const PlasmicRateAndCommentCount = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicRateAndCommentCount'));
const PlasmicRateProgressBar = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicRateProgressBar'));
const PlasmicServices = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicServices'));
const PlasmicActivity = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicActivity'));
const PlasmicAbout = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicAbout'));
const PlasmicLocationSelectionScript = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript'));
const PlasmicProductCard = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicProductCard'));
const PlasmicSearchResults = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicSearchResults'));
const PlasmicBookingSchedules = dynamic(() => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingSchedules'));
const PlasmicSearchRequest = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicSearchRequest'));
const PlasmicBookingAddressesWrapper = dynamic(() => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingAddressesWrapper'));
const PlasmicBookingAddressesCard = dynamic(() => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingAddressesCard'));
const PlasmicBookingServiceList = dynamic(() => import('.plasmic/plasmic/paziresh_24_booking/PlasmicBookingServiceList'));
const PlasmicProfileHead = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileHead'));
const PlasmicProfileAbout = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileAbout'));
const PlasmicProfileActivity = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileActivity'));
const PlasmicProfileSeo = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileSeo'));
const PlasmicProfileGallery = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileGallery'));
const PlasmicFilterListView = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterListView'));
const PlasmicFilterExpertiseView = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterExpertiseView'));
const PlasmicFilterSelectedView = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterSelectedView'));
const PlasmicFilterRow = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicFilterRow'));
const PlasmicHomePageShortcuts = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicHomePageShortcuts'));
const PlasmicOnlineVisit = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicOnlineVisit'));
const PlasmicSearch = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicSearch'));
const PlasmicSeoBox = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicSeoBox'));
const PlasmicSort = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicSort'));
const PlasmicConsultBanner = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicConsultBanner'));
const PlasmicResultView = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicResultView'));
const PlasmicRisman = dynamic(() => import('.plasmic/plasmic/risman/PlasmicRisman'));
const PlasmicReceiptActionButtons = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons'));
const PlasmicRecentSearch = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicRecentSearch'));

import { PlasmicReviewRateAndReviews__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndReviews';
import { PlasmicReviewProgressList__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicReviewProgressList';
import { PlasmicReceiptActionButtons__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons';
import { PlasmicClaim__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicClaim';
import { PlasmicReviewList__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicReviewList';
import { PlasmicRateAndCommentCount__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicRateAndCommentCount';
import { PlasmicRateProgressBar__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicRateProgressBar';
import { PlasmicServices__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicServices';
import { PlasmicActivity__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicActivity';
import { PlasmicAbout__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicAbout';
import { PlasmicLocationSelectionScript__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript';
import { PlasmicProductCard__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicProductCard';
import { PlasmicSearchResults__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSearchResults';
import { PlasmicBookingSchedules__ArgProps } from '.plasmic/plasmic/paziresh_24_booking/PlasmicBookingSchedules';
import { PlasmicSearchRequest__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSearchRequest';
import { PlasmicBookingAddressesWrapper__ArgProps } from '.plasmic/plasmic/paziresh_24_booking/PlasmicBookingAddressesWrapper';
import { PlasmicBookingAddressesCard__ArgProps } from '.plasmic/plasmic/paziresh_24_booking/PlasmicBookingAddressesCard';
import { PlasmicBookingServiceList__ArgProps } from '.plasmic/plasmic/paziresh_24_booking/PlasmicBookingServiceList';
import { PlasmicProfileHead__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileHead';
import { PlasmicProfileAbout__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileAbout';
import { PlasmicProfileActivity__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileActivity';
import { PlasmicProfileSeo__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileSeo';
import { PlasmicProfileGallery__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileGallery';
import { PlasmicFilterListView__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterListView';
import { PlasmicFilterExpertiseView__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterExpertiseView';
import { PlasmicFilterSelectedView__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterSelectedView';
import { PlasmicFilterRow__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterRow';
import { PlasmicHomePageShortcuts__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicHomePageShortcuts';
import { PlasmicOnlineVisit__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicOnlineVisit';
import { PlasmicSearch__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSearch';
import { PlasmicSeoBox__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSeoBox';
import { PlasmicRecentSearch__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicRecentSearch';
import { PlasmicSort__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSort';
import { PlasmicConsultBanner__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicConsultBanner';
import { PlasmicResultView__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicResultView';
import { PlasmicRisman__ArgProps } from '.plasmic/plasmic/risman/PlasmicRisman';

export const Components = {
  Claim: { Component: PlasmicClaim, id: '5jjwlzFYfMqI', propsAllowed: PlasmicClaim__ArgProps, projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  ReviewList2: {
    Component: PlasmicReviewList2,
    id: 'Kz2u6VAJ02yE',
    propsAllowed: PlasmicReviewList__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateAndCommentCount2: {
    Component: PlasmicReviewRateAndCommentCount,
    id: 'etOCIhcu_Yx5',
    propsAllowed: PlasmicRateAndCommentCount__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateProgressList: {
    Component: PlasmicProgressList,
    id: 'xpGRRNKB86D2',
    propsAllowed: PlasmicReviewProgressList__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateAndReviews: {
    Component: PlasmicReviewRateAndReviews,
    id: 'qb59XTke1gWO',
    propsAllowed: PlasmicReviewRateAndReviews__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  ReviewList: {
    Component: PlasmicReviewList,
    id: 'Bx6gxTOoja9k',
    propsAllowed: PlasmicReviewList__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateAndCommentCount: {
    Component: PlasmicRateAndCommentCount,
    id: 'u3Jgb_UfiULc',
    propsAllowed: PlasmicRateAndCommentCount__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateProgressBar: {
    Component: PlasmicRateProgressBar,
    id: 'YorKPsj5-KCA',
    propsAllowed: PlasmicRateProgressBar__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  ReceiptActionButtons: {
    Component: PlasmicReceiptActionButtons,
    id: 'EifS7TB9I3zC',
    propsAllowed: PlasmicReceiptActionButtons__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  },
  Services: {
    Component: PlasmicServices,
    id: 'q3FGMz6XNu9L',
    propsAllowed: PlasmicServices__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  },
  Activity: {
    Component: PlasmicActivity,
    id: 'pggD1apWa_wW',
    propsAllowed: PlasmicActivity__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  },
  About: { Component: PlasmicAbout, id: '6mjf324FkOZF', propsAllowed: PlasmicAbout__ArgProps, projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  LocationSelectionScript: {
    Component: PlasmicLocationSelectionScript,
    id: '5bzKtjF_q24p',
    propsAllowed: PlasmicLocationSelectionScript__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  ProductCard: {
    Component: PlasmicProductCard,
    id: 'NhMGML-3Q4Pu',
    propsAllowed: PlasmicProductCard__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  SearchResults: {
    Component: PlasmicSearchResults,
    id: 'XhSI4pxMLR3L',
    propsAllowed: PlasmicSearchResults__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Schedules: {
    Component: PlasmicBookingSchedules,
    id: 'Mt_WMP6AHSGv',
    propsAllowed: PlasmicBookingSchedules__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  SearchRequest: {
    Component: PlasmicSearchRequest,
    id: '35vwUOYdUX87',
    propsAllowed: PlasmicSearchRequest__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  AddressesWrapper: {
    Component: PlasmicBookingAddressesWrapper,
    id: 'Z7E4nvI5-Dtv',
    propsAllowed: PlasmicBookingAddressesWrapper__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  AddressesCard: {
    Component: PlasmicBookingAddressesCard,
    id: 'z1k0-vbkFtby',
    propsAllowed: PlasmicBookingAddressesCard__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  BookingServiceList: {
    Component: PlasmicBookingServiceList,
    id: 'fpdRSzutXHoq',
    propsAllowed: PlasmicBookingServiceList__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  ProfileHead: {
    Component: PlasmicProfileHead,
    id: 'fKBGdItR62E2',
    propsAllowed: PlasmicProfileHead__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileAbout: {
    Component: PlasmicProfileAbout,
    id: 'VlJvd0AHTT9_',
    propsAllowed: PlasmicProfileAbout__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileActivity: {
    Component: PlasmicProfileActivity,
    id: 'LIHtK_X7GpDY',
    propsAllowed: PlasmicProfileActivity__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileSeo: {
    Component: PlasmicProfileSeo,
    id: 'AyZkzO0Ld0SI',
    propsAllowed: PlasmicProfileSeo__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileGallery: {
    Component: PlasmicProfileGallery,
    id: '-M0f8W0T-8eT',
    propsAllowed: PlasmicProfileGallery__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  FilterListView: {
    Component: PlasmicFilterListView,
    id: 'Z5K_XiJUvXFD',
    propsAllowed: PlasmicFilterListView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  FilterExpertiseView: {
    Component: PlasmicFilterExpertiseView,
    id: 'N8MUho5TZvBe',
    propsAllowed: PlasmicFilterExpertiseView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  FilterSelectedView: {
    Component: PlasmicFilterSelectedView,
    id: 'hzanYC1FO-Wr',
    propsAllowed: PlasmicFilterSelectedView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  FilterRow: {
    Component: PlasmicFilterRow,
    id: 'OC23iWRW1Dia',
    propsAllowed: PlasmicFilterRow__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  HomePageShortcuts: {
    Component: PlasmicHomePageShortcuts,
    id: 'pfHDjmK7Jo_j',
    propsAllowed: PlasmicHomePageShortcuts__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  OnlineVisit: {
    Component: PlasmicOnlineVisit,
    id: 'kiuZ6fZVjKcZ',
    propsAllowed: PlasmicOnlineVisit__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  SearchInput: {
    Component: PlasmicSearch,
    id: 'd_qMEJ14UZf0',
    propsAllowed: PlasmicSearch__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  RecentSearch: {
    Component: PlasmicRecentSearch,
    id: 'ARWFU9130hug',
    propsAllowed: PlasmicRecentSearch__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  SeoBox: {
    Component: PlasmicSeoBox,
    id: 'LCOgDdMa8kxO',
    propsAllowed: PlasmicSeoBox__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Sort: {
    Component: PlasmicSort,
    id: 's-wlX7BnSeTl',
    propsAllowed: PlasmicSort__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  ConsultBanner: {
    Component: PlasmicConsultBanner,
    id: 'KmDr0VPQLI2_',
    propsAllowed: PlasmicConsultBanner__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  ResultView: {
    Component: PlasmicResultView,
    id: 'NYqLbXm7Qk5C',
    propsAllowed: PlasmicResultView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Risman: {
    Component: PlasmicRisman,
    id: 'KinPlL1Jj1j3',
    propsAllowed: PlasmicRisman__ArgProps,
    projectId: 'bN5uNsAhTefwW3S14VjvMG',
  },
};
