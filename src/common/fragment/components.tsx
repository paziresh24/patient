import dynamic from 'next/dynamic';
// DR-08 §۲۰: these arrays used to be imported straight from the Plasmic modules. `__ArgProps` is a
// runtime value, not a type, so each of those static imports pulled the component module — and its
// CSS — back into the initial graph, which is exactly what the `dynamic()` calls below exist to
// avoid. Measured on a production build of the listing page: page CSS 510KB→263KB (-48%), page JS
// 2195KB→1071KB (-51%). The generated map imports nothing; it is produced by
// scripts/generate-fragment-arg-props.js and drift-guarded by argProps.generated.spec.ts.
import { FRAGMENT_ARG_PROPS } from './argProps.generated';
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const ReviewList2 = dynamic(() => import('.plasmic/ReviewList2'));
const PlasmicReviewRateAndCommentCount = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndCommentCount'));
const PlasmicProgressList = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewProgressList'));
const PlasmicReviewRateAndReviews = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewRateAndReviews'));
const ReviewList = dynamic(() => import('.plasmic/ReviewList'));
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


export const Components = {
  Claim: { Component: PlasmicClaim, id: '5jjwlzFYfMqI', propsAllowed: FRAGMENT_ARG_PROPS.PlasmicClaim__ArgProps, projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  ReviewList2: {
    Component: ReviewList2,
    id: 'Kz2u6VAJ02yE',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicReviewList__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateAndCommentCount2: {
    Component: PlasmicReviewRateAndCommentCount,
    id: 'etOCIhcu_Yx5',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicRateAndCommentCount__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateProgressList: {
    Component: PlasmicProgressList,
    id: 'xpGRRNKB86D2',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicReviewProgressList__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateAndReviews: {
    Component: PlasmicReviewRateAndReviews,
    id: 'qb59XTke1gWO',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicReviewRateAndReviews__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  ReviewList: {
    Component: ReviewList,
    id: 'Bx6gxTOoja9k',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicReviewList__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateAndCommentCount: {
    Component: PlasmicRateAndCommentCount,
    id: 'u3Jgb_UfiULc',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicRateAndCommentCount__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  RateProgressBar: {
    Component: PlasmicRateProgressBar,
    id: 'YorKPsj5-KCA',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicRateProgressBar__ArgProps,
    projectId: 'qQzsBf58SqzNJX45iggq96',
  },
  ReceiptActionButtons: {
    Component: PlasmicReceiptActionButtons,
    id: 'EifS7TB9I3zC',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicReceiptActionButtons__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  },
  Services: {
    Component: PlasmicServices,
    id: 'q3FGMz6XNu9L',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicServices__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  },
  Activity: {
    Component: PlasmicActivity,
    id: 'pggD1apWa_wW',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicActivity__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
  },
  About: { Component: PlasmicAbout, id: '6mjf324FkOZF', propsAllowed: FRAGMENT_ARG_PROPS.PlasmicAbout__ArgProps, projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  LocationSelectionScript: {
    Component: PlasmicLocationSelectionScript,
    id: '5bzKtjF_q24p',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicLocationSelectionScript__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  ProductCard: {
    Component: PlasmicProductCard,
    id: 'NhMGML-3Q4Pu',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicProductCard__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  SearchResults: {
    Component: PlasmicSearchResults,
    id: 'XhSI4pxMLR3L',
    propsAllowed: [...FRAGMENT_ARG_PROPS.PlasmicSearchResults__ArgProps, 'overrides'],
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Schedules: {
    Component: PlasmicBookingSchedules,
    id: 'Mt_WMP6AHSGv',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicBookingSchedules__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  SearchRequest: {
    Component: PlasmicSearchRequest,
    id: '35vwUOYdUX87',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicSearchRequest__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  AddressesWrapper: {
    Component: PlasmicBookingAddressesWrapper,
    id: 'Z7E4nvI5-Dtv',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicBookingAddressesWrapper__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  AddressesCard: {
    Component: PlasmicBookingAddressesCard,
    id: 'z1k0-vbkFtby',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicBookingAddressesCard__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  BookingServiceList: {
    Component: PlasmicBookingServiceList,
    id: 'fpdRSzutXHoq',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicBookingServiceList__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  ProfileHead: {
    Component: PlasmicProfileHead,
    id: 'fKBGdItR62E2',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicProfileHead__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileAbout: {
    Component: PlasmicProfileAbout,
    id: 'VlJvd0AHTT9_',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicProfileAbout__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileActivity: {
    Component: PlasmicProfileActivity,
    id: 'LIHtK_X7GpDY',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicProfileActivity__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileSeo: {
    Component: PlasmicProfileSeo,
    id: 'AyZkzO0Ld0SI',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicProfileSeo__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  ProfileGallery: {
    Component: PlasmicProfileGallery,
    id: '-M0f8W0T-8eT',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicProfileGallery__ArgProps,
    projectId: '7r312uiqyadpVPdnRoAggk',
  },
  FilterListView: {
    Component: PlasmicFilterListView,
    id: 'Z5K_XiJUvXFD',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicFilterListView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  FilterExpertiseView: {
    Component: PlasmicFilterExpertiseView,
    id: 'N8MUho5TZvBe',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicFilterExpertiseView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  FilterSelectedView: {
    Component: PlasmicFilterSelectedView,
    id: 'hzanYC1FO-Wr',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicFilterSelectedView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  FilterRow: {
    Component: PlasmicFilterRow,
    id: 'OC23iWRW1Dia',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicFilterRow__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  HomePageShortcuts: {
    Component: PlasmicHomePageShortcuts,
    id: 'pfHDjmK7Jo_j',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicHomePageShortcuts__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  OnlineVisit: {
    Component: PlasmicOnlineVisit,
    id: 'kiuZ6fZVjKcZ',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicOnlineVisit__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  SearchInput: {
    Component: PlasmicSearch,
    id: 'd_qMEJ14UZf0',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicSearch__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  RecentSearch: {
    Component: PlasmicRecentSearch,
    id: 'ARWFU9130hug',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicRecentSearch__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  SeoBox: {
    Component: PlasmicSeoBox,
    id: 'LCOgDdMa8kxO',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicSeoBox__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Sort: {
    Component: PlasmicSort,
    id: 's-wlX7BnSeTl',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicSort__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  ConsultBanner: {
    Component: PlasmicConsultBanner,
    id: 'KmDr0VPQLI2_',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicConsultBanner__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  ResultView: {
    Component: PlasmicResultView,
    id: 'NYqLbXm7Qk5C',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicResultView__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Risman: {
    Component: PlasmicRisman,
    id: 'KinPlL1Jj1j3',
    propsAllowed: FRAGMENT_ARG_PROPS.PlasmicRisman__ArgProps,
    projectId: 'bN5uNsAhTefwW3S14VjvMG',
  },
};

