import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SamanBooking from './SamanBooking';
import SamanBookingFlow from './SamanBookingFlow';

interface SamanBookingWithFlowProps {
  slug: string;
  displayName: string;
  university?: string;
}

const SamanBookingWithFlow = ({ slug, displayName, university }: SamanBookingWithFlowProps) => {
  const router = useRouter();
  const isSamanBookingEnabled = useFeatureIsOn('saman-booking');
  const [currentStep, setCurrentStep] = useState<'overview' | 'select_center'>('overview');

  // If samanBooking is not enabled, don't render anything
  if (!isSamanBookingEnabled) {
    return null;
  }

  // Check if we should show the center selection flow
  const shouldShowCenterSelection = router.query.step === 'SELECT_CENTER' || currentStep === 'select_center';

  if (shouldShowCenterSelection) {
    return <SamanBookingFlow slug={slug} displayName={displayName} university={university} />;
  }

  // Default to the original SamanBooking component
  return <SamanBooking slug={slug} displayName={displayName} />;
};

export default SamanBookingWithFlow;
