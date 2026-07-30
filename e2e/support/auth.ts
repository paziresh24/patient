import fs from 'fs';
import path from 'path';

/**
 * وضعیتِ لاگین به‌صورتِ `storageState` نگهداری می‌شود.
 *
 * چرا اینطوری: لاگینِ پذیرش۲۴ با OTP است و OTP قابلِ اتوماسیون نیست (و نباید هم باشد). پس
 * **یک‌بار** به‌صورتِ دستی لاگین می‌کنی (`npm run e2e:login`)، کوکی/استوریج ذخیره می‌شود، و از آن
 * به بعد همه‌ی تست‌های نیازمندِ لاگین بدونِ دخالتِ انسان اجرا می‌شوند تا وقتی session منقضی شود.
 *
 * ⛔ این فایل هرگز commit نمی‌شود (`.gitignore`) — حاوی توکنِ یک حسابِ واقعی است.
 */
export const AUTH_STATE_PATH = path.join(__dirname, '..', '.auth', 'user.json');

export function hasAuthState(): boolean {
  return fs.existsSync(AUTH_STATE_PATH);
}

/** پیامِ یکسانِ skip، تا در گزارشِ تست معلوم باشد «نبودِ لاگین» است نه شکستِ محصول. */
export const NEEDS_LOGIN =
  'نیازمندِ session لاگین‌شده — یک‌بار `npm run e2e:login` را اجرا کن (OTP دستی) و دوباره تست بگیر.';
