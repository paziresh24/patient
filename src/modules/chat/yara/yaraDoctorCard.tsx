/**
 * The doctor card inside a Yara answer — the /s listing card, reused.
 *
 * The owner's launch-day review (2026-08-06) said it plainly: the trust signals
 * the classic listing spent years earning — photo, verified tick, satisfaction
 * with review count, address, waiting time — were missing here, and a doctor
 * recommendation without them is just a name. So this does not invent a chat-side
 * card; it renders `SearchCard`, the same component `/s` trusts, fed from the
 * trust fields khesht now copies off the same SEAPI row.
 *
 * Missing fields degrade inside `SearchCard` itself (it tolerates every absent
 * prop), so a response from an older khesht build renders the same card, just
 * thinner — no second "minimal card" code path to keep honest.
 */
import SearchCard from '@/modules/search/components/card/card';
import type { BadgeProps } from '@/modules/search/components/badge';
import { useMemo } from 'react';
import type { ChatCard } from '../chatApi';

interface YaraDoctorCardProps {
  card: ChatCard;
  onClick: () => void;
}

/**
 * «چرا یارا ایشان را پیشنهاد می‌کند» — the reasoning strip under each card.
 *
 * ⛔ Every line here is a field khesht actually sent. The design mock also shows
 * a quoted patient review and a per-topic review count; neither exists in
 * `ChatCard`, and inventing a quote under a doctor's name is not a styling
 * decision. So the strip renders what we have and disappears entirely when we
 * have nothing — an empty box would be a claim of its own.
 */
const WhyStrip = ({ card }: { card: ChatCard }) => {
  const facts: string[] = [];
  if (card.satisfaction !== undefined && card.rates_count)
    facts.push(`${card.satisfaction}٪ رضایت از ${card.rates_count.toLocaleString('fa-IR')} نظر`);
  if (card.waiting_time) facts.push(`زمان انتظار: ${card.waiting_time}`);
  if (card.online_visit) facts.push('ویزیت آنلاین دارد');
  if (!facts.length) return null;

  return (
    <div
      data-testid="yara-card-why"
      className="mx-4 mb-4 flex flex-col gap-1.5 rounded-[0.6875rem] border border-solid border-[#eff1f4] bg-[#fafbfc] px-3.5 py-3"
    >
      <span className="text-[0.6875rem] font-bold text-[#344054]">چرا یارا ایشان را پیشنهاد می‌کند</span>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#475467]">
        {facts.map(f => (
          <span key={f}>{f}</span>
        ))}
      </div>
    </div>
  );
};

/**
 * The recommended doctors as **one** surface with dividers, the way the panel
 * design frames them — a short list to choose from, not three loose cards that
 * read as three separate offers.
 */
export const YaraDoctorList = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-[0.875rem] border border-solid border-[#e6e8ec] bg-white [&>*+*]:border-0 [&>*+*]:border-t [&>*+*]:border-solid [&>*+*]:border-[#eff1f4]">
    {children}
  </div>
);

export const YaraDoctorCard = ({ card, onClick }: YaraDoctorCardProps) => {
  const badges = useMemo(() => {
    const list: BadgeProps[] = [];
    if (card.waiting_time) list.push({ title: `زمان انتظار: ${card.waiting_time}`, icon: 'clock-icon', type: 'info' });
    // owner (2026-08-07): کارتِ /s قیمت را دارد، کارتِ یارا نداشت. واحد در khesht
    // به تومان تبدیل شده، پس این‌جا فقط قالب‌بندیِ فارسی می‌ماند.
    if (card.online_visit_price)
      list.push({ title: `ویزیت آنلاین: ${card.online_visit_price.toLocaleString('fa-IR')} تومان`, type: 'info' });
    if (card.online_visit) list.push({ title: 'ویزیت آنلاین', type: 'success' });
    return list;
  }, [card]);

  if (!card.title) return null;

  return (
    <div data-testid="yara-result-card" className="w-full" onClick={onClick}>
      <SearchCard
        type={card.type === 'center' ? 'center' : 'doctor'}
        // The frame belongs to `YaraDoctorList`, so the card gives up its own
        // border/shadow/rounding rather than drawing a second one inside it.
        className="!rounded-none !border-0 !shadow-none"
        baseInfo={{
          displayName: card.title,
          expertise: card.expertise,
          avatar: card.image,
          url: card.url,
          // پروفایلِ bulk (import شده و claim نشده) تیک نمی‌گیرد؛ نبودِ فیلد = ادعا نکن.
          isVerify: card.is_bulk === false,
          ...(card.satisfaction !== undefined && card.rates_count
            ? { rate: { satisfaction: card.satisfaction, count: card.rates_count } }
            : {}),
        }}
        details={{
          ...(card.address ? { address: { text: card.address } } : {}),
          ...(badges.length ? { badges } : {}),
        }}
        actions={[
          {
            text: card.online_visit ? 'نوبت‌دهی و ویزیت آنلاین' : 'مشاهده پروفایل و نوبت‌دهی',
            description: '',
            outline: false,
            action: () => {
              window.location.href = card.url;
            },
          },
        ]}
      />
      <WhyStrip card={card} />
    </div>
  );
};

export default YaraDoctorCard;
