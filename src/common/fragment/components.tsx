import dynamic from 'next/dynamic';
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const PlasmicReviewCard = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicReviewCard'));
const PlasmicServices = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicServices'));
const PlasmicActivity = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicActivity'));
const PlasmicAbout = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicAbout'));
const PlasmicLocationSelectionScript = dynamic(() => import('.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript'));

import PlasmicReceiptActionButtons, {
  PlasmicReceiptActionButtons__ArgProps,
} from '.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons';
import { PlasmicClaim__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicClaim';
import { PlasmicReviewCard__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicReviewCard';
import { PlasmicServices__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicServices';
import { PlasmicActivity__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicActivity';
import { PlasmicAbout__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicAbout';
import { PlasmicLocationSelectionScript__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript';
import PlasmicProductCard, { PlasmicProductCard__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicProductCard';
import PlasmicSearchResults, { PlasmicSearchResults__ArgProps } from '.plasmic/plasmic/paziresh_24_search/PlasmicSearchResults';

export const Components = {
  Claim: { Component: PlasmicClaim, id: '5jjwlzFYfMqI', propsAllowed: PlasmicClaim__ArgProps, projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  ReviewCard: {
    Component: PlasmicReviewCard,
    id: '3_YM1K_ShdiP',
    propsAllowed: PlasmicReviewCard__ArgProps,
    projectId: 'iDYgiKJB9Yi7CUB81stQBK',
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
};
