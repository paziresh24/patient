import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { ARASH_VOICE_AGENT_FEATURE } from '../constants';
import { useVoiceCallUiStore } from '../store/voiceCallUi';

/**
 * PERF (DR-08, ghane/docs/dev-requests/dr-08-listing-pagespeed.md §۱۲) — این دکمه در
 * `bottomNavigation` (یعنی گرافِ initialِ هر صفحه) است ولی فقط برای کاربرِ **دکترِ لاگین‌کرده با
 * فلگِ روشن** رندر می‌شود. importِ استاتیکِ آورا آن گیت را دور می‌زد: آورا از هوکِ
 * `useTrackVolume` استفاده می‌کند، پس `@livekit/components-react` + `livekit-client` (~۴۸۶KB خام)
 * در گرافِ initialِ صفحاتِ لیستینگ می‌نشست. با `next/dynamic` فقط وقتی می‌آید که واقعاً رندر شود.
 * گاردِ خودکار: `scripts/check-initial-chunks.js`.
 */
const AgentAudioVisualizerAura = dynamic(() => import('../agents-ui/agent-audio-visualizer-aura'), {
  ssr: false,
});

/** Brand primary — matches Tailwind `primary` / Paziresh24 blue. */
const BRAND_AURA = '#3861fb';

/** Center bottom-nav entry — vivid brand Aura that opens the Arash call. */
export function VoiceBottomNavButton() {
  const isFeatureEnabled = useFeatureIsOn(ARASH_VOICE_AGENT_FEATURE);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const openCall = useVoiceCallUiStore(state => state.openCall);
  const active = useVoiceCallUiStore(state => state.active);

  if (!isFeatureEnabled || pending || !isLogin || !user?.id || !isDoctorUser(user)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openCall}
      aria-label="تماس با آرش، دستیار صوتی"
      className={classNames(
        'flex h-full w-full flex-col items-center justify-center',
        'transition-transform duration-150 ease-out active:scale-[0.94]',
      )}
    >
      <span className="pointer-events-none flex h-12 w-12 items-center justify-center">
        <AgentAudioVisualizerAura
          size="sm"
          // `listening` keeps brand blue vivid; `idle` dims too much for a nav affordance.
          state={active ? 'speaking' : 'listening'}
          color={BRAND_AURA}
          colorShift={0}
          themeMode="light"
          className="!h-12 !w-12"
        />
      </span>
    </button>
  );
}
