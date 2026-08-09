/**
 * The in-conversation surfaces: appointments, a cancellation confirmation, a
 * provider detail card, and the history switcher.
 *
 * They live in their own file so `conversationalSearchPanel.tsx` stays a *flow* —
 * ask, render, follow up — rather than becoming a wall of markup. Each surface here
 * is presentational; the only one that has a rule of its own is `ConfirmCancel`,
 * and that rule is stated on it.
 */
import { useEffect, useState } from 'react';
import type { TurnResponse, ConversationSummary } from './chatApi';
import { listConversations } from './chatApi';
import type { BookingSummary } from './userDataBridge';

const STATUS_LABEL: Record<number, string> = {
  1: 'رزرو شده',
  2: 'ویزیت شده',
  3: 'لغو شده',
  4: 'در انتظار پرداخت',
};

export const BookingList = ({
  bookings,
  loading,
  onCancel,
}: {
  bookings: BookingSummary[];
  loading: boolean;
  /** Absent ⇒ read-only list (no action was requested). */
  onCancel?: (booking: BookingSummary) => void;
}) => {
  if (loading) return <p className="text-xs text-slate-400">در حال گرفتن نوبت‌های شما…</p>;
  if (bookings.length === 0)
    return (
      <p className="rounded-2xl bg-slate-100 px-3 py-2 text-xs leading-6">
        نوبتِ فعالی پیدا نکردم. اگر تازه نوبت گرفته‌اید، چند لحظه بعد دوباره بپرسید.
      </p>
    );
  return (
    <ul className="flex flex-col gap-2">
      {bookings.map((b, i) => (
        <li key={b.bookId} className="flex flex-col gap-1 rounded-xl border border-solid border-slate-200 p-3 text-xs">
          <div className="flex items-start justify-between gap-2">
            <span className="font-bold">
              {i + 1}. {b.doctor}
            </span>
            <span className="shrink-0 text-slate-500">{STATUS_LABEL[b.status] ?? ''}</span>
          </div>
          {b.expertise && <span className="text-slate-500">{b.expertise}</span>}
          <span className="text-slate-600">{b.bookTime}</span>
          {b.centerName && <span className="text-slate-500">{b.centerName}</span>}
          <div className="mt-1 flex gap-3">
            <a href={b.url} className="text-primary underline">
              جزئیات نوبت
            </a>
            {onCancel && b.status !== 3 && (
              <button type="button" className="text-red-600 underline" onClick={() => onCancel(b)}>
                لغو این نوبت
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

/**
 * The double-check the owner asked for («حتماً دبل‌چک بگیریم ازش»).
 *
 * It shows the appointment's own details — doctor, time, centre — because a
 * confirmation that only says "are you sure?" confirms nothing: the user has no way
 * to tell whether the right appointment was selected. Nothing is called until تأیید
 * is tapped, and the panel only reaches this surface with an appointment it fetched
 * itself (see `resolveBooking`).
 */
export const ConfirmCancel = ({
  booking,
  busy,
  onConfirm,
  onDismiss,
}: {
  booking: BookingSummary;
  busy: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}) => (
  <div className="flex flex-col gap-2 rounded-xl border border-solid border-red-300 bg-red-50 p-3 text-xs">
    <p className="font-bold text-red-700">این نوبت لغو شود؟</p>
    <p className="leading-6 text-slate-700">
      {booking.doctor}
      {booking.expertise ? ` — ${booking.expertise}` : ''}
      <br />
      {booking.bookTime}
      {booking.centerName ? ` — ${booking.centerName}` : ''}
    </p>
    <p className="text-[0.625rem] leading-5 text-slate-500">
      لغو نوبت قابل بازگشت نیست. اگر ویزیت آنلاین بوده و زمانش نرسیده، مبلغ طی ۱ تا ۷۲ ساعت کاری برمی‌گردد.
    </p>
    <div className="flex gap-2">
      <button
        type="button"
        className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white disabled:opacity-50"
        disabled={busy}
        onClick={onConfirm}
      >
        {busy ? 'در حال لغو…' : 'بله، لغو کن'}
      </button>
      <button type="button" className="rounded-xl border border-solid border-slate-300 px-4 py-2" onClick={onDismiss}>
        منصرف شدم
      </button>
    </div>
  </div>
);

/** Address / phone / availability for one named provider, without leaving the chat. */
export const ProviderCard = ({ provider }: { provider: NonNullable<TurnResponse['provider']> }) => {
  const center = provider.centers.find(c => c.address || c.phones.length) ?? provider.centers[0];
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-solid border-slate-200 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <a href={provider.url} className="font-bold text-primary underline">
          {provider.name}
        </a>
        {provider.satisfaction !== null && <span className="text-slate-500">رضایت {provider.satisfaction}٪</span>}
      </div>
      {provider.expertise && <span className="text-slate-500">{provider.expertise}</span>}
      {center?.address && (
        <span className="leading-6 text-slate-700">
          آدرس: {center.city ? `${center.city}، ` : ''}
          {center.address}
        </span>
      )}
      {center?.phones?.length ? (
        <span className="text-slate-700">
          تلفن:{' '}
          {center.phones.map(p => (
            <a key={p} href={`tel:${p}`} className="ml-2 text-primary underline" dir="ltr">
              {p}
            </a>
          ))}
        </span>
      ) : null}
      {provider.insurances.length > 0 && <span className="text-slate-600">بیمه: {provider.insurances.join('، ')}</span>}
      {provider.waiting_time && <span className="text-slate-500">معطلی: {provider.waiting_time}</span>}
      <div className="mt-1 flex flex-wrap gap-2">
        {provider.actions.map(a => (
          <a key={a.url} href={a.url} className="rounded-xl bg-primary px-3 py-2 font-bold text-white">
            {a.title}
          </a>
        ))}
      </div>
    </div>
  );
};

/**
 * «بیمار باید سریع بتواند بین چت‌هایش سوییچ کند» — the switcher.
 *
 * Loaded on open rather than with the panel: most sessions never touch it, and it is
 * an authenticated round-trip. An empty list renders as an explanation, not as a
 * blank area, because "no history yet" and "history is broken" look identical
 * otherwise.
 */
export const HistoryDrawer = ({
  activeId,
  onPick,
  onClose,
}: {
  activeId: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) => {
  const [items, setItems] = useState<ConversationSummary[] | null>(null);

  useEffect(() => {
    let alive = true;
    void listConversations().then(rows => {
      if (alive) setItems(rows);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-solid border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">گفتگوهای من</span>
        <button type="button" className="text-xs text-slate-500 underline" onClick={onClose}>
          بستن
        </button>
      </div>
      {items === null && <p className="text-xs text-slate-400">در حال بارگذاری…</p>}
      {items?.length === 0 && (
        <p className="text-xs leading-6 text-slate-500">هنوز گفتگوی ذخیره‌شده‌ای ندارید.</p>
      )}
      <ul className="flex flex-col gap-1">
        {items?.map(c => (
          <li key={c.conversation_id}>
            <button
              type="button"
              className={`w-full rounded-lg px-2 py-2 text-right text-xs ${
                c.conversation_id === activeId ? 'bg-primary/10 font-bold' : 'hover:bg-white'
              }`}
              onClick={() => onPick(c.conversation_id)}
            >
              <span className="block truncate">{c.title || 'بدون عنوان'}</span>
              <span className="block text-[0.625rem] text-slate-400">
                {c.turn_count} پیام · {new Date(c.last_message_at).toLocaleDateString('fa-IR')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
