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

export const YaraDoctorCard = ({ card, onClick }: YaraDoctorCardProps) => {
  const badges = useMemo(() => {
    const list: BadgeProps[] = [];
    if (card.waiting_time) list.push({ title: `زمان انتظار: ${card.waiting_time}`, icon: 'clock-icon', type: 'info' });
    if (card.online_visit) list.push({ title: 'ویزیت آنلاین', type: 'success' });
    return list;
  }, [card]);

  if (!card.title) return null;

  return (
    <div data-testid="yara-result-card" className="w-full" onClick={onClick}>
      <SearchCard
        type={card.type === 'center' ? 'center' : 'doctor'}
        className="!shadow-none border border-solid border-slate-200"
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
    </div>
  );
};

export default YaraDoctorCard;
