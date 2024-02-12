import dynamic from 'next/dynamic';
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const PlasmicReviewCard = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicReviewCard'));
const PlasmicServices = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicServices'));
const PlasmicActivity = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicActivity'));
import PlasmicReceiptActionButtons, {
  PlasmicReceiptActionButtons__ArgProps,
} from '.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons';
import { PlasmicClaim__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicClaim';
import { PlasmicReviewCard__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicReviewCard';
import { PlasmicServices__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicServices';
import { PlasmicActivity__ArgProps } from '.plasmic/plasmic/paziresh_24/PlasmicActivity';

export const Components = {
  Claim: { Component: PlasmicClaim, id: '5jjwlzFYfMqI', propsAllowed: PlasmicClaim__ArgProps },
  ReviewCard: { Component: PlasmicReviewCard, id: '3_YM1K_ShdiP', propsAllowed: PlasmicReviewCard__ArgProps },
  ReceiptActionButtons: { Component: PlasmicReceiptActionButtons, id: 'EifS7TB9I3zC', propsAllowed: PlasmicReceiptActionButtons__ArgProps },
  Services: { Component: PlasmicServices, id: 'q3FGMz6XNu9L', propsAllowed: PlasmicServices__ArgProps },
  Activity: { Component: PlasmicActivity, id: 'pggD1apWa_wW', propsAllowed: PlasmicActivity__ArgProps },
};
