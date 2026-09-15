/**
 * Encode optional extra wallet top-up into payment_method for panel-payment → topups.
 * Contract: `{gateway}_topups+{extra_rial}` — literal `+` (topups parses it; do not force %2B).
 */
export function encodeExtraWalletTopupPaymentMethod(paymentMethod: string, extraRial: number): string {
  const method = String(paymentMethod || '').trim();
  if (!method) return method;

  const extra = Math.floor(Number(extraRial) || 0);
  if (!Number.isFinite(extra) || extra <= 0) return method;

  const lower = method.toLowerCase();
  if (lower === 'wallet' || lower.startsWith('wallet')) return method;

  const match = lower.match(/^(.+?)(?:_topups(?:\+\d+)?)?$/);
  const base = match?.[1] || lower;
  if (!base || base === 'wallet') return method;

  return `${base}_topups+${extra}`;
}

export function tomanToRial(toman: number): number {
  return Math.floor(Number(toman) || 0) * 10;
}
