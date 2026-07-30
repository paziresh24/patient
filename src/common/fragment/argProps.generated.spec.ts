import { FRAGMENT_ARG_PROPS } from './argProps.generated';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { collect } = require('../../../scripts/generate-fragment-arg-props');

/**
 * گاردِ drift برای `argProps.generated.ts` (DR-08 §۲۰).
 *
 * چرا لازم است: `components.tsx` دیگر `Plasmic<X>__ArgProps` را از خودِ ماژولِ کامپوننت import
 * نمی‌کند (آن importها ماژول و CSSش را به گرافِ اولیه برمی‌گرداندند و `dynamic()` را بی‌اثر
 * می‌کردند). هزینه‌اش این است که حالا یک **کپیِ تولیدشده** داریم که می‌تواند از منبع عقب بماند —
 * و عقب‌ماندنش بی‌صدا است: کامپوننت رندر می‌شود ولی propی که فراموش شده به آن نمی‌رسد.
 *
 * این تست خودِ منبع (`.plasmic/**`) را دوباره می‌خواند و با فایلِ کامیت‌شده مقایسه می‌کند.
 * ⚠️ اگر قرمز شد: `node scripts/generate-fragment-arg-props.js` را بزن و خروجی را کامیت کن.
 */
describe('argProps.generated — همگام با منبعِ Plasmic', () => {
  const fresh: Record<string, string[]> = collect();

  it('هیچ کامپوننتی جا نیفتاده', () => {
    const missing = Object.keys(fresh).filter(k => !(k in FRAGMENT_ARG_PROPS));
    expect(missing).toEqual([]);
  });

  it('هیچ ورودیِ مرده‌ای نمانده', () => {
    const stale = Object.keys(FRAGMENT_ARG_PROPS).filter(k => !(k in fresh));
    expect(stale).toEqual([]);
  });

  it('لیستِ propها برای هر کامپوننت دقیقاً یکی است', () => {
    const drifted: string[] = [];
    for (const [k, v] of Object.entries(fresh)) {
      const have = FRAGMENT_ARG_PROPS[k];
      if (!have || have.join('|') !== v.join('|')) drifted.push(k);
    }
    expect(drifted).toEqual([]);
  });

  it('نقشه خالی نیست (گاردِ generatorِ خراب)', () => {
    expect(Object.keys(FRAGMENT_ARG_PROPS).length).toBeGreaterThan(100);
  });
});
