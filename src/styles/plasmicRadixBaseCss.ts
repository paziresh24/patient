/**
 * بلوکِ base CSSِ Radix که Plasmic به‌ازایِ هر instanceِ کامپوننتِ Radix (Dialog/Popover/...) قبلاً
 * به‌صورتِ یک <style> inline در SSR تکرار می‌کرد (۱۵۱ بار روی /s/tehran/dermatology/، ۳۷۲KB خالصِ
 * تکرار از ۸۸۸KBِ HTMLِ خام — ghane DR-08 §۱۴ لاگِ ۲۰۲۶-۰۷-۳۱ (۵)). این ماژول همان CSS را **یک‌بار**
 * export می‌کند تا در جایِ درستِ cascade (انتهایِ <body>، نه <head>) رندر شود.
 *
 * ⚠️ چرا انتهایِ body و نه <head>/‎_app.tsx‎ (رگرسیونِ 2026-07-31،
 * ghane/docs/bug-tickets/city-modal-radix-basestyles-cascade.md):
 * وقتی همین CSS به یک stylesheetِ معمولیِ head منتقل شد، قاعده‌ی ‎.pl__fixed { position: fixed }‎
 * در تساویِ specificityِ (0,1,0) با CSS-moduleِ Plasmicِ دیالوگ (‎.PlasmicDialog_pcls_...
 * { position: relative }‎) رقابت کرد — و چون CSS moduleِ Plasmic *بعد از* sheetِ head می‌آمد،
 * برنده شد. نتیجه: کادرِ «انتخاب شهر» بازمی‌شد ولی ‎position: relative‎ می‌گرفت و ~۳۱۰۰px پایینِ
 * viewport رندر می‌شد (دیالوگِ نامرئی). یک <style> در **انتهایِ body** همیشه آخرین عنصرِ سند است،
 * پس در هر تساویِ specificity برنده می‌ماند — دقیقاً همان موقعیتی که ‎BaseStyles()‎ قبل از این
 * بهینه‌سازی داشت (رندرِ inline به‌ازایِ هر instance، هم داخلِ body).
 *
 * محتوایِ زیر عیناً از ‎node_modules/@plasmicpkgs/radix-ui/dist/index.mjs‎ استخراج شده — با اجرایِ
 * **همان** template-literal + ‎.replace(/\n\./g, ".pl__")‎ی که خودِ پکیج انجام می‌دهد
 * (‎scripts/lib/extractRadixBaseStyles.js‎)، نه کپیِ دستی. اگر نسخه‌ی ‎@plasmicpkgs/radix-ui‎ آپدیت
 * شد و این استایل‌ها عوض شدند، این فایل باید با همان اسکریپت از نو تولید شود —
 * ‎scripts/patch-radix-basestyles.js‎ یک گاردِ drift دارد که اگر این فایل با استخراجِ تازه از پکیج
 * فرق کند، با پیامِ واضح fail می‌کند تا این desync گم نشود.
 */
export const plasmicRadixBaseCss = ".pl__box-border {\n  box-sizing: border-box;\n}\n.pl__sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}.pl__absolute {\n    position: absolute;\n}.pl__relative {\n    position: relative;\n}.pl__transition {\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n}.pl__h-full {\n    height: 100%;\n}.pl__z-50 { z-index: 50;  }.pl__fixed { position: fixed; }.pl__inset-0 { top: 0; left: 0; right: 0; bottom: 0; }.pl__bottom-0 {\n    bottom: 0px;\n}.pl__left-0 {\n    left: 0px;\n}.pl__right-0 {\n    right: 0px;\n}.pl__top-0 {\n    top: 0px;\n}.pl__right-4 {\n    right: 1rem;\n}.pl__top-4 {\n    top: 1rem;\n}.pl__h-4 { height: 1rem; }.pl__w-4 { width: 1rem; }.pl__outline-none { outline: none; }\n\n@keyframes plsmc-enter {\n\n    from {\n        opacity: var(--tw-enter-opacity, 1);\n        transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));\n    }\n}\n\n@keyframes plsmc-exit {\n\n    to {\n        opacity: var(--tw-exit-opacity, 1);\n        transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));\n    }\n}.pl__animate-in,.pl__data-\\[state\\=open\\]\\:animate-in[data-state=open] {\n  animation-name: plsmc-enter;\n  animation-duration: 150ms;\n  --tw-enter-opacity: initial;\n  --tw-enter-scale: initial;\n  --tw-enter-rotate: initial;\n  --tw-enter-translate-x: initial;\n  --tw-enter-translate-y: initial;\n}.pl__animate-out,.pl__data-\\[state\\=closed\\]\\:animate-out[data-state=closed] {\n  animation-name: plsmc-exit;\n  animation-duration: 150ms;\n  --tw-exit-opacity: initial;\n  --tw-exit-scale: initial;\n  --tw-exit-rotate: initial;\n  --tw-exit-translate-x: initial;\n  --tw-exit-translate-y: initial;\n}.pl__data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side=bottom] {\n    --tw-enter-translate-y: -0.5rem;\n}\n.pl__data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side=left] {\n    --tw-enter-translate-x: 0.5rem;\n}\n.pl__data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side=right] {\n    --tw-enter-translate-x: -0.5rem;\n}\n.pl__data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side=top] {\n    --tw-enter-translate-y: 0.5rem;\n}\n\n";
