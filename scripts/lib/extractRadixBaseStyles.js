/**
 * استخراجِ برنامه‌ایِ بلوکِ base CSSِ Radix از خودِ پکیجِ `@plasmicpkgs/radix-ui`.
 *
 * چرا این فایل جداگانه است: هم `scripts/patch-radix-basestyles.js` (گاردِ drift، هر dev/build)
 * و هم اسکریپتِ یک‌بارِ تولیدِ `src/styles/plasmicRadixBaseCss.ts` باید دقیقاً همین منطق را اجرا
 * کنند — یکی‌بودنِ منطقِ استخراج خودش گاردِ اصلیِ ضدِ drift است (اگر دو نسخه‌ی متفاوت از استخراج
 * وجود داشت، ممکن بود یکی drift را نبیند).
 *
 * روش: خودِ پکیج مقدارِ `prefixedBaseStyles` را این‌طور می‌سازد:
 *   var prefixedBaseStyles = `...template literal...`.replace(/\n\./g, ".pl__");
 * ما همان expressionِ متنیِ بینِ `var prefixedBaseStyles = ` و انتهایِ فراخوانیِ `.replace(...)`
 * را از سورسِ فایل بیرون می‌کشیم و با `new Function` اجرایش می‌کنیم — یعنی **همان template + همان
 * replace**ی که خودِ پکیج انجام می‌دهد، نه بازنویسیِ دستیِ regex/رشته در این‌جا (ghane DR-08 §۲۵.۴
 * بندِ ۲: «برنامه‌ای استخراج کن، نه کپیِ دستی»).
 *
 * ⚠️ این فایل هیچ importِ خارجی ندارد و از `node_modules` چیزی جز خواندنِ متنِ فایل نمی‌خواهد —
 * پس در یک اسکریپتِ CommonJSِ ساده (بدونِ ts-node) هم قابل‌استفاده است.
 */
const fs = require('fs');
const path = require('path');

const RADIX_PKG_FILE = path.join(__dirname, '..', '..', 'node_modules', '@plasmicpkgs', 'radix-ui', 'dist', 'index.mjs');

const START_MARKER = 'var prefixedBaseStyles = ';
// توجه: این یک رشته‌ی JSِ معمولی است که باید دقیقاً همان متنِ سورس را نشان بدهد، یعنی
// بک‌اسلش‌های تحت‌اللفظی `\n\.` — نه یک newlineِ واقعی. پس escapeِ دوبل لازم است.
const END_MARKER = '.replace(/\\n\\./g, ".pl__");';

/**
 * @param {string} [pkgFile] مسیرِ فایلِ index.mjsِ پکیج — پیش‌فرض همان مسیرِ node_modulesِ این repo.
 * @returns {string} محتوایِ نهاییِ CSS (بعد از اعمالِ replace، یعنی با کلاس‌هایِ `.pl__*`).
 */
function extractRadixBaseCss(pkgFile = RADIX_PKG_FILE) {
  if (!fs.existsSync(pkgFile)) {
    throw new Error(`extractRadixBaseStyles: فایلِ پکیج پیدا نشد: ${pkgFile}`);
  }
  const content = fs.readFileSync(pkgFile, 'utf8');

  const startIdx = content.indexOf(START_MARKER);
  if (startIdx === -1) {
    throw new Error(
      `extractRadixBaseStyles: الگویِ «${START_MARKER}» در ${pkgFile} پیدا نشد — احتمالاً نسخه‌ی @plasmicpkgs/radix-ui عوض شده.`,
    );
  }
  const exprStart = startIdx + START_MARKER.length;

  const endIdx = content.indexOf(END_MARKER, exprStart);
  if (endIdx === -1) {
    throw new Error(
      `extractRadixBaseStyles: الگویِ پایانیِ «${END_MARKER}» بعد از prefixedBaseStyles در ${pkgFile} پیدا نشد — احتمالاً مکانیزمِ prefix عوض شده.`,
    );
  }
  // شاملِ فراخوانیِ ‎.replace(...)‎ باش، ولی نه `;`ِ انتهایی.
  const exprEnd = endIdx + END_MARKER.length - 1;
  const expr = content.slice(exprStart, exprEnd);

  // expr چیزی از این جنس است: `\n.box-border {...}`.replace(/\n\./g, ".pl__")
  // یک template literalِ بدونِ هیچ interpolation/دسترسیِ بیرونی، پس اجرایش امن است.
  return new Function(`"use strict"; return (${expr});`)();
}

module.exports = { extractRadixBaseCss, RADIX_PKG_FILE };
