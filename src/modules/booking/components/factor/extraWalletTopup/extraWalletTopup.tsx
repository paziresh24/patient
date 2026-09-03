import { useEffect, useState } from 'react';
import { addCommas } from '@persian-tools/persian-tools';
import {
  EXTRA_WALLET_TOPUP_DEFAULT_TOMAN,
  EXTRA_WALLET_TOPUP_MAX_TOMAN,
  EXTRA_WALLET_TOPUP_STEP_TOMAN,
} from '@/modules/booking/constants/extraWalletTopup';

interface ExtraWalletTopupProps {
  enabled: boolean;
  selectedToman: number;
  onEnabledChange: (enabled: boolean) => void;
  onSelectedTomanChange: (toman: number) => void;
}

function parseTomanInput(raw: string): number {
  const digits = String(raw || '').replace(/[^\d]/g, '');
  if (!digits) return 0;
  return Math.floor(Number(digits));
}

/** Amount editor: [+] amount [-] in RTL (plus on the right, minus on the left). */
export const ExtraWalletTopupEditor = (props: ExtraWalletTopupProps) => {
  const { enabled, selectedToman, onEnabledChange, onSelectedTomanChange } = props;
  const [draft, setDraft] = useState(() => (selectedToman > 0 ? addCommas(selectedToman) : ''));

  useEffect(() => {
    if (!enabled) return;
    setDraft(selectedToman > 0 ? addCommas(selectedToman) : '');
  }, [enabled, selectedToman]);

  if (!enabled) return null;

  const commitAmount = (next: number) => {
    const clamped = Math.min(EXTRA_WALLET_TOPUP_MAX_TOMAN, Math.max(0, Math.floor(next) || 0));
    onSelectedTomanChange(clamped);
  };

  const handlePlusStep = () => {
    commitAmount((selectedToman || 0) + EXTRA_WALLET_TOPUP_STEP_TOMAN);
  };

  const handleMinusStep = () => {
    const current = Math.max(0, Math.floor(selectedToman) || 0);
    // Already 0 → close box (and keep last remembered amount for reopen)
    if (current <= 0) {
      onEnabledChange(false);
      return;
    }
    // Above step → subtract normally
    if (current > EXTRA_WALLET_TOPUP_STEP_TOMAN) {
      commitAmount(current - EXTRA_WALLET_TOPUP_STEP_TOMAN);
      return;
    }
    // ≤ step (e.g. زیر/مساوی ۱۰۰ هزار) → first − zeros; second − closes
    commitAmount(0);
  };

  return (
    <div className="flex items-center gap-2" dir="rtl">
      <button
        type="button"
        aria-label={`افزایش ${addCommas(EXTRA_WALLET_TOPUP_STEP_TOMAN)} تومان`}
        onClick={handlePlusStep}
        className="shrink-0 px-1 text-xl font-bold leading-none text-primary hover:opacity-80"
      >
        +
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
        <input
          type="text"
          inputMode="numeric"
          className="min-w-0 flex-1 bg-transparent text-center text-sm font-medium text-slate-800 outline-none"
          value={draft}
          onChange={e => {
            const parsed = parseTomanInput(e.target.value);
            setDraft(e.target.value.replace(/[^\d]/g, '') ? addCommas(parsed) : '');
            commitAmount(parsed);
          }}
          onBlur={() => commitAmount(parseTomanInput(draft))}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          aria-label="مبلغ شارژ اضافه به تومان"
        />
        <span className="shrink-0 text-xs text-slate-500">تومان</span>
      </div>
      <button
        type="button"
        aria-label={`کاهش ${addCommas(EXTRA_WALLET_TOPUP_STEP_TOMAN)} تومان`}
        onClick={handleMinusStep}
        className="shrink-0 px-1 text-xl font-bold leading-none text-slate-600 hover:opacity-80"
      >
        −
      </button>
    </div>
  );
};

/** Round visit total up to the next step (e.g. ۸۲٬۴۰۰ → ۱۰۰٬۰۰۰). */
function roundUpToStep(toman: number): number {
  const step = EXTRA_WALLET_TOPUP_STEP_TOMAN;
  if (toman <= 0) return 0;
  return Math.ceil(toman / step) * step;
}

export function openExtraWalletTopupAmount(currentToman: number, visitTotalToman: number): number {
  const visit = Math.floor(Number(visitTotalToman) || 0);
  const roundedVisit =
    visit > 0
      ? Math.min(EXTRA_WALLET_TOPUP_MAX_TOMAN, roundUpToStep(visit))
      : EXTRA_WALLET_TOPUP_DEFAULT_TOMAN;

  // Keep a remembered custom amount on reopen — but not the old raw visit total
  // (e.g. ۱۸۲٬۵۰۰ was stored before round-up; treat as default → ۲۰۰٬۰۰۰).
  if (currentToman > 0 && currentToman !== visit) {
    return Math.min(EXTRA_WALLET_TOPUP_MAX_TOMAN, currentToman);
  }

  return roundedVisit;
}

export default ExtraWalletTopupEditor;
