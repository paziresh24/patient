/**
 * DR-13 — روتِ /rate-us/ : یک wrapperِ نازک طبقِ قراردادِ repo (AGENTS.md: منطق در src/modules،
 * صفحه فقط wrapper). خودِ صفحه و CSSش در src/modules/rate-us/components/rateUsPage.tsx است.
 *
 * ⚠️ هیچ فایلِ غیرِ-page ای (مثلِ *.spec.tsx) زیرِ src/pages نگذار: next.config.js هیچ
 * pageExtensions ندارد، پس هر فایلِ این‌جا یک route است و فایلِ بدونِ default export بیلد را می‌شکند.
 */
import RateUsPage from '@/modules/rate-us/components/rateUsPage';

export default RateUsPage;
