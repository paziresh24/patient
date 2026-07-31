import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { ARASH_VOICE_AGENT_FEATURE } from '../constants';
import { isArashEligibleDoctor } from '../utils/isArashEligibleDoctor';
import { ArashFloatingAuraButton } from './ArashFloatingAuraButton';
import { CallOverlay } from './CallOverlay';

/** Single host for Arash chrome — mount once in app layout. */
export function VoiceCallHost() {
  const isFeatureEnabled = useFeatureIsOn(ARASH_VOICE_AGENT_FEATURE);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);

  if (!isFeatureEnabled || pending || !user?.id || !isArashEligibleDoctor(user)) {
    return null;
  }

  return (
    <>
      <ArashFloatingAuraButton />
      <CallOverlay />
    </>
  );
}
