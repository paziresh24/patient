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
import Logo from '@/common/components/atom/logo';
import { sendYaraInvite } from '../chatApi';
import { useChatGate } from '../useChatGate';

export const YaraInvite = () => {
  // 'invite' = پیشنهادِ هوم‌پیج ⇒ **تابعِ درصدِ rollout**. درِ مستقیمِ `/yara`
  // عمداً این قید را ندارد (useChatGate را ببین).
  const gate = useChatGate('invite');
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
      {/*
        owner: «آرم و لوگوی یارا نداریم؛ همان لوگوی پذیرش۲۴ است.» همان قاعده‌ای
        که در خودِ چت اعمال شد — یک مارکِ برندِ دومِ بنفش داخلِ محصولِ خودمان از
        کاربر می‌خواهد به چیزِ تازه‌ای اعتماد کند، در حالی که نکته دقیقاً این است
        که این **پذیرش۲۴** است که حرف می‌زند.
      */}
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-solid border-[#e6e8ec] bg-white"
      >
        <Logo width={12} type="compact" />
      </span>
      <span>
        نمی‌دانید از کجا شروع کنید؟ <span className="font-bold text-primary">از یارا بپرسید</span>
      </span>
    </Link>
  );
};

export default YaraInvite;
