import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { ARASH_VOICE_AGENT_FEATURE } from '../constants';

/**
 * PERF (DR-08, ghane/docs/dev-requests/dr-08-listing-pagespeed.md §۱۲) — همان کلاسِ باگی که در
 * `src/firebase/analytics.ts` پیدا شد، این‌جا تکرار شده بود: گیتِ runtime (فلگ + دکتر-بودنِ کاربر)
 * فقط دورِ **رندر** بود، نه دورِ **import**. چون این کامپوننت در `_app.tsx` مانت می‌شود، importِ
 * استاتیکِ `CallOverlay` کلِ `livekit-client` + `@livekit/components-react` (~۴۸۶KB خام) را وارد
 * گرافِ initialِ **هر** صفحه می‌کرد — از جمله صفحاتِ لیستینگِ `/s/*` که هرگز تماسِ صوتی ندارند.
 *
 * فیکس: `next/dynamic` با `ssr: false`. رفتار عوض نمی‌شود (این UI از اول client-only بود و فقط پس
 * از پاس‌شدنِ همین گیت رندر می‌شد)؛ فقط chunkِ livekit وقتی دانلود می‌شود که واقعاً لازم باشد.
 *
 * مرزِ اعتبار: این فیکس فقط همین یک مصرف‌کننده را async می‌کند. هر importِ استاتیکِ دیگر از
 * `CallOverlay` دوباره livekit را به گرافِ initial برمی‌گرداند — گاردِ خودکارش
 * `src/perf/initial-chunks.spec.ts` است که علیهِ خروجیِ واقعیِ build اجرا می‌شود.
 */
const CallOverlay = dynamic(() => import('./CallOverlay'), { ssr: false });

/** Single host for the call UI — mount once in app layout. */
export function VoiceCallHost() {
  const isFeatureEnabled = useFeatureIsOn(ARASH_VOICE_AGENT_FEATURE);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);

  if (!isFeatureEnabled || pending || !user?.id || !isDoctorUser(user)) {
    return null;
  }

  return <CallOverlay />;
}
