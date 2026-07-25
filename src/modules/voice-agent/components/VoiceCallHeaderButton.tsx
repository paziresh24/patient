import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import classNames from '@/common/utils/classNames';
import { ds } from '@/modules/doctorHome/designSystem';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Phone } from 'lucide-react';
import { ARASH_VOICE_AGENT_FEATURE } from '../constants';
import { useVoiceCallUiStore } from '../store/voiceCallUi';

/** Header chrome control — sits with notifications, uses DS icon treatment. */
export function VoiceCallHeaderButton() {
  const isFeatureEnabled = useFeatureIsOn(ARASH_VOICE_AGENT_FEATURE);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const openCall = useVoiceCallUiStore(state => state.openCall);

  if (!isFeatureEnabled || pending || !isLogin || !user?.id || !isDoctorUser(user)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openCall}
      aria-label="تماس با آرش، دستیار صوتی"
      className={classNames(
        'flex h-9 w-9 items-center justify-center rounded-full',
        ds.icon.containerCircle,
        ds.motion.press,
        'hover:bg-primary/10',
      )}
    >
      <Phone size={18} strokeWidth={2} className={ds.icon.color} />
    </button>
  );
}
