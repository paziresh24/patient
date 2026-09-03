/** GrowthBook feature — optional extra wallet charge on factor page. */
export const FACTOR_EXTRA_WALLET_TOPUP_FEATURE = 'factor-extra-wallet-topup';

/** Step for ± controls — ۱۰۰ هزار تومان (= colloquial «۱۰۰ تومن»). */
export const EXTRA_WALLET_TOPUP_STEP_TOMAN = 100_000;

/** Fallback if visit total is unavailable — step unit (۱۰۰ هزار تومان). */
export const EXTRA_WALLET_TOPUP_DEFAULT_TOMAN = EXTRA_WALLET_TOPUP_STEP_TOMAN;

/** Soft max in تومان — align with adaptor MAX 50_000_000 rial. */
export const EXTRA_WALLET_TOPUP_MAX_TOMAN = 5_000_000;

/** Snapp (and snapp_topups / snapp_topups+N) cannot be used with extra wallet top-up. */
export function isSnappPaymentMethod(paymentMethod: string): boolean {
  const lower = String(paymentMethod || '')
    .trim()
    .toLowerCase();
  if (!lower) return false;
  const base = lower.replace(/_topups(?:\+\d+)?$/, '');
  return base === 'snapp';
}
