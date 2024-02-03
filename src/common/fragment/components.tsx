import dynamic from 'next/dynamic';
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const PlasmicReviewCard = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicReviewCard'));
import PlasmicReceiptActionButtons from '.plasmic/plasmic/paziresh_24/PlasmicReceiptActionButtons';

export const Components = {
  Claim: { Component: PlasmicClaim, id: '5jjwlzFYfMqI' },
  ReviewCard: { Component: PlasmicReviewCard, id: '3_YM1K_ShdiP' },
  ReceiptActionButtons: { Component: PlasmicReceiptActionButtons, id: 'EifS7TB9I3zC' },
};
