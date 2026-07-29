/**
 * PERF (DR-08, ghane/docs/dev-requests/dr-08-listing-pagespeed.md §۱۲) — این barrel عمداً
 * `CallOverlay` و `useVoiceCall`/`formatCallTimer` را re-export نمی‌کند.
 *
 * چرا: مصرف‌کننده‌های بیرونیِ این ماژول (`_app.tsx` و `bottomNavigation.tsx`) از همین barrel
 * import می‌کنند، و یک `export { X } from './X'` استاتیک است — یعنی حتی اگر هیچ‌کس `CallOverlay`
 * را نخواهد، کلِ گرافش (`livekit-client` + `@livekit/components-react`، ~۴۸۶KB خام) وارد گرافِ
 * initialِ **هر** صفحه می‌شود. lazy کردنِ `CallOverlay` داخلِ `VoiceCallHost` به‌تنهایی کافی نبود؛
 * با اندازه‌گیری روی خروجیِ build ثابت شد که همین دو خطِ barrel آن را برمی‌گرداند.
 *
 * این نام‌ها هیچ مصرف‌کننده‌ای بیرونِ خودِ ماژول نداشتند (grep شد)؛ داخلِ ماژول با مسیرِ نسبی
 * import می‌شوند. گاردِ خودکار: `scripts/check-initial-chunks.js`.
 */
export { createVoiceSession } from './api/createVoiceSession';
export { VoiceAssistantCard } from './components/VoiceAssistantCard';
export { VoiceBottomNavButton } from './components/VoiceBottomNavButton';
export { VoiceCallHeaderButton } from './components/VoiceCallHeaderButton';
export { VoiceCallHost } from './components/VoiceCallHost';
export { ARASH_VOICE_AGENT_FEATURE } from './constants';
export { buildUiContext, type UiContext } from './context/uiContext';
export { useVoiceCallUiStore } from './store/voiceCallUi';
