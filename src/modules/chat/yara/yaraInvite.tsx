/**
 * خطِ دعوتِ کم‌صدای هوم‌پیج به «یارا» (DR-11 §۱۳ تصمیمِ ۴).
 *
 * قاعده‌های سختِ این کامپوننت:
 *  - **کم‌صدا**: یک خطِ متنی زیرِ کادرِ جستجو — نه کارت، نه بنر، نه انیمیشن.
 *    کاربری که مسیرش روشن است نباید مزاحمت ببیند؛ کاربرِ سردرگم همین‌جا پیدایش می‌کند.
 *  - **خارج از باکت = هیچ**: همه‌ی گیت‌ها (master env + رول‌اوتِ GrowthBook +
 *    allow-listِ هاست + لاگین) از همان `useChatGate` می‌آیند — یک منبعِ حقیقت،
 *    نه یک کپیِ دوم که drift کند. `null` یعنی هیچ DOMی، پس صفر layout-shift
 *    برای کاربرِ خارج از رول‌اوت.
 *  - **قابلِ سنجش**: view یک‌بار در هر mount و click؛ CTRِ همین دو، عددِ M-8 است.
 *
 * ⚠️ محلِ مصرف: فقط دو ویوی هوم‌پیجِ وب (`patientHomePage` و `homePageBody`).
 * عمداً نه در `apphome` (فاز ۱ فقط وب) و نه در `/s` — پنلِ /s در cutover خاموش می‌شود.
 */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { sendYaraInvite } from '../chatApi';
import { useChatGate } from '../useChatGate';

export const YaraInvite = () => {
  const gate = useChatGate();
  const viewSent = useRef(false);

  useEffect(() => {
    if (gate.allowed && !viewSent.current) {
      viewSent.current = true;
      sendYaraInvite('view');
    }
  }, [gate.allowed]);

  if (!gate.allowed) return null;

  return (
    <Link
      href="/yara"
      prefetch={false}
      dir="rtl"
      data-testid="yara-invite"
      className="flex items-center gap-2 self-start px-1 py-0.5 text-xs text-slate-500 hover:opacity-80 lg:w-[50rem] lg:self-center"
      onClick={() => sendYaraInvite('click')}
    >
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7A5AF8] to-[#2B6BE6] text-[0.6rem] font-extrabold text-white"
      >
        ی
      </span>
      <span>
        نمی‌دانید از کجا شروع کنید؟ <span className="font-bold text-[#7A5AF8]">از یارا بپرسید</span>
      </span>
    </Link>
  );
};

export default YaraInvite;
