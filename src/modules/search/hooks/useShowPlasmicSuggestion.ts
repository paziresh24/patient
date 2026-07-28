import useCustomize from '@/common/hooks/useCustomize';
import { useFeatureValue } from '@growthbook/growthbook-react';

/**
 * تصمیمِ نمایشِ suggestionِ جدید (Plasmic).
 *
 * قبلاً همه‌ی call-siteها این را با `!customize.partnerKey` پر می‌کردند؛ یعنی سایت‌های اختصاصیِ
 * مراکز/دانشگاه‌ها (partner) همیشه به UIِ قدیمی می‌افتادند و با هیچ فلگی قابلِ تغییر نبود.
 * حالا partner هم به‌صورتِ پیش‌فرض همان UIِ سایت اصلی را می‌بیند و
 * `search_plasmic_suggestion_partner` نقشِ kill-switch را دارد (در GrowthBook می‌شود
 * per-domain خاموشش کرد؛ نبودِ فلگ = روشن).
 */
export const useShowPlasmicSuggestion = () => {
  const partnerKey = useCustomize(state => state.customize?.partnerKey);
  const enabledForPartner = useFeatureValue('search_plasmic_suggestion_partner', true);

  if (!partnerKey) return true;
  return !!enabledForPartner;
};

export default useShowPlasmicSuggestion;
