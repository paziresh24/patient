/**
 * پچِ idempotent برایِ `@plasmicpkgs/radix-ui` — ریشه‌کنِ تکرارِ ۱۵۱بارهٔ یک بلوکِ `<style>` در SSR.
 *
 * چرا: تابعِ `BaseStyles()` در این پکیج به‌ازایِ **هر instance** از کامپوننت‌هایِ Radix (Dialog/Popover/...)
 * یک `<style dangerouslySetInnerHTML>` با همان بلوکِ ثابتِ ~۲.۵KB (کلاس‌هایِ `.pl__*` + `@keyframes plsmc-enter`)
 * رندر می‌کند. روی صفحاتِ لیستینگ که ده‌ها Radix instance دارند، همین یک بلوک ده‌ها بار تکرار می‌شود
 * (روی /s/tehran/dermatology/ اندازه‌گیری شد: ۱۵۱ بار، ۳۷۲KB خالص از ۸۸۸KB HTMLِ خام).
 *
 * راهِ حل: خودِ CSS جای دیگری (`src/styles/plasmic-radix-base.css`, یک‌بار در `_app.tsx`) inject می‌شود،
 * پس این‌جا فقط لازم است `BaseStyles()` هیچ‌چیز رندر نکند (`return null`) تا موتور دیگر این تگ‌هایِ
 * تکراری را در HTMLِ سرور ننویسد.
 *
 * چرا دست‌زدن به node_modules مجاز است: Plasmic در حالِ discontinue شدن است (ghane DR-08)، پس
 * patch-package/PR بالادستی هزینه‌اش را نمی‌ارزد؛ این اسکریپت idempotent است و با pattern-drift
 * (آپدیتِ نسخهٔ پکیج) به‌جایِ patchِ خاموش، fail می‌کند تا حواسمان جمعِ تغییرِ upstream باشد.
 *
 * ⚠️ هرگز در این worktree `npm install`/`npm ci` اجرا نکن — node_modules یک junction به
 * worktreeِ اصلی است و install آن را خراب می‌کند.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILES = [
  path.join(__dirname, '..', 'node_modules', '@plasmicpkgs', 'radix-ui', 'dist', 'index.js'),
  path.join(__dirname, '..', 'node_modules', '@plasmicpkgs', 'radix-ui', 'dist', 'index.mjs'),
];

const OLD_BODY =
  'function BaseStyles() {\n  return /* @__PURE__ */ React.createElement("style", { dangerouslySetInnerHTML: { __html: prefixedBaseStyles } });\n}';

const NEW_BODY = 'function BaseStyles() {\n  return null;\n}';

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ patch-radix-basestyles: فایل پیدا نشد: ${filePath}`);
    console.error('   احتمالاً نسخهٔ @plasmicpkgs/radix-ui تغییر کرده یا node_modules نصب نشده.');
    process.exitCode = 1;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(NEW_BODY)) {
    console.log(`✅ patch-radix-basestyles: از قبل patch شده، رد شد: ${filePath}`);
    return true;
  }

  if (content.includes(OLD_BODY)) {
    const patched = content.replace(OLD_BODY, NEW_BODY);
    fs.writeFileSync(filePath, patched, 'utf8');
    console.log(`✅ patch-radix-basestyles: patch شد: ${filePath}`);
    return true;
  }

  console.error(`❌ patch-radix-basestyles: patternِ موردِ انتظارِ BaseStyles() در فایل پیدا نشد: ${filePath}`);
  console.error('   احتمالاً نسخهٔ @plasmicpkgs/radix-ui عوض شده — این اسکریپت را با محتوایِ جدید هماهنگ کن.');
  process.exitCode = 1;
  return false;
}

let ok = true;
for (const filePath of TARGET_FILES) {
  if (!patchFile(filePath)) ok = false;
}

if (!ok) {
  process.exit(1);
}
