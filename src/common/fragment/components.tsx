import dynamic from 'next/dynamic';
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const PlasmicReviewList = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicReviewList'));
const PlasmicRateAndCommentCount = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicRateAndCommentCount'));
const PlasmicRateProgressBar = dynamic(() => import('.plasmic/plasmic/ravi_r_r/PlasmicRateProgressBar'));
const PlasmicServices = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicServices'));
const PlasmicActivity = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicActivity'));
const PlasmicAbout = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicAbout'));
const PlasmicLocationSelectionScript = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript'));

import PlasmicReceiptActionButtons, {
  PlasmicReceiptActionButtons__ArgProps,
} from '.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons';
import { PlasmicClaim__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicClaim';
import { PlasmicReviewList__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicReviewList';
import { PlasmicRateAndCommentCount__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicRateAndCommentCount';
import { PlasmicRateProgressBar__ArgProps } from '.plasmic/plasmic/ravi_r_r/PlasmicRateProgressBar';

import { PlasmicServices__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicServices';
import { PlasmicActivity__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicActivity';
import { PlasmicAbout__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicAbout';
import { PlasmicLocationSelectionScript__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript';
import PlasmicProductCard, { PlasmicProductCard__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicProductCard';
import PlasmicSearchResults, { PlasmicSearchResults__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSearchResults';
import PlasmicSchedules, { PlasmicSchedules__ArgProps } from '.plasmic/plasmic/paziresh_24_booking/PlasmicSchedules';
import PlasmicSearchRequest, { PlasmicSearchRequest__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSearchRequest';
import PlasmicAddresses, { PlasmicAddresses__ArgProps } from '.plasmic/plasmic/paziresh_24_booking/PlasmicAddresses';
import PlasmicBookingServiceList, {
  PlasmicBookingServiceList__ArgProps,
} from '.plasmic/plasmic/paziresh_24_booking/PlasmicBookingServiceList';
import PlasmicProfileHead, { PlasmicProfileHead__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileHead';
import PlasmicProfileAbout, { PlasmicProfileAbout__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileAbout';
import PlasmicProfileActivity, { PlasmicProfileActivity__ArgProps } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileActivity';
import PlasmicFilterListView, { PlasmicFilterListView__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterListView';
import PlasmicFilterExpertiseView, {
  PlasmicFilterExpertiseView__ArgProps,
} from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterExpertiseView';
import PlasmicFilterSelectedView, {
  PlasmicFilterSelectedView__ArgProps,
} from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterSelectedView';
import PlasmicFilterRow, { PlasmicFilterRow__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicFilterRow';
import PlasmicHomePageShortcuts, { PlasmicHomePageShortcuts__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicHomePageShortcuts';

export const Components = {
  Claim: { Component: PlasmicClaim, id: '5jjwlzFYfMqI', propsAllowed: PlasmicClaim__ArgProps, projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
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
    Component: PlasmicSchedules,
    id: 'Mt_WMP6AHSGv',
    propsAllowed: PlasmicSchedules__ArgProps,
    projectId: '8NbkXymcLwvMUC2yXeRrWk',
  },
  SearchRequest: {
    Component: PlasmicSearchRequest,
    id: '35vwUOYdUX87',
    propsAllowed: PlasmicSearchRequest__ArgProps,
    projectId: 'sMdpLWyxbzDCruwMRffW2m',
  },
  Addresses: {
    Component: PlasmicAddresses,
    id: 'xUh1xJ9SUAar',
    propsAllowed: PlasmicAddresses__ArgProps,
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
};
