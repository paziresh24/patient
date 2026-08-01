/**
 * The gate in front of «یارا» — everything that decides *whether* the page runs,
 * so `yaraChat.tsx` can be nothing but the conversation itself.
 *
 * ### Four states, none of them a 404 and none of them a spinner that never ends
 *
 * | gate reason            | what the patient sees                      |
 * |------------------------|---------------------------------------------|
 * | not mounted / pending  | neutral loading — never a flash of either    |
 * | `not_logged_in`        | why, plus a login button that comes back here|
 * | anything else          | a polite «هنوز فعال نشده» page with a way out|
 * | `null` (allowed)       | the assistant                                |
 *
 * ⛔ **A refused gate is not a 404.** The old `/chat` route `notFound()`s, which is
 * right for an experiment nobody was told about. `/yara` is a destination we will
 * hand to people, so a person who is simply not in the bucket must get a sentence,
 * not a broken link.
 *
 * ### The mounted guard is not cosmetic
 *
 * `useChatGate` reads `window.location.host`, which is absent during SSR, so the
 * server always computes `host_not_allowed`. Rendering that decision would show
 * «فعال نشده» for one frame to an eligible user — and, worse, would make the
 * university host check look like it had fired when it had not. So nothing is
 * decided until the client has mounted.
 *
 * The host allow-list itself is untouched and still fail-closed: a partner or
 * `*.ac.ir` host lands in the "anything else" row, exactly like a disabled flag.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useChatGate } from '../useChatGate';
import YaraChat from './yaraChat';

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div dir="rtl" className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center">
    {children}
  </div>
);

export const YaraPage = () => {
  const router = useRouter();
  const gate = useChatGate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || gate.reason === 'auth_pending') {
    return (
      <Shell>
        <p data-testid="yara-loading" className="text-sm text-slate-400">
          در حال آماده‌سازی…
        </p>
      </Shell>
    );
  }

  if (gate.reason === 'not_logged_in') {
    // The repo's standard pattern (dashboard sidebar, receipt page): a plain
    // `redirect_url` back to where the user was, so login returns them here.
    const back = router.asPath && router.asPath !== '/' ? router.asPath : '/yara';
    return (
      <Shell>
        <h1 className="text-base font-bold text-slate-800">برای گفتگو با یارا وارد حساب‌تان شوید</h1>
        <p className="max-w-sm text-sm leading-7 text-slate-600">
          یارا به نوبت‌ها و اطلاعات حساب شما نیاز دارد تا بتواند کمک‌تان کند؛ به همین دلیل فقط برای کاربران واردشده در
          دسترس است.
        </p>
        <a
          data-testid="yara-login-cta"
          href={`/login?redirect_url=${encodeURIComponent(back)}`}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          ورود به حساب کاربری
        </a>
        <Link href="/" prefetch={false} className="text-xs text-slate-500 underline">
          بازگشت به صفحه‌ی اصلی
        </Link>
      </Shell>
    );
  }

  if (!gate.allowed) {
    return (
      <Shell>
        <h1 data-testid="yara-unavailable" className="text-base font-bold text-slate-800">
          یارا هنوز برای حساب شما فعال نشده است.
        </h1>
        <p className="max-w-sm text-sm leading-7 text-slate-600">
          به‌تدریج در دسترس کاربران بیشتری قرار می‌گیرد. تا آن زمان می‌توانید از جستجوی معمولی استفاده کنید.
        </p>
        <Link href="/" prefetch={false} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
          بازگشت به صفحه‌ی اصلی
        </Link>
      </Shell>
    );
  }

  return <YaraChat />;
};

export default YaraPage;
