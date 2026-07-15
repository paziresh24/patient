import ChannelDetailes from './channelDetailes';
import { Messenger } from './channelDetailes';
import ServiceBulletList from '../../components/serviceCard/serviceBulletList';

interface OnlineVisitHighlightsProps {
  messengers: Messenger[];
  safeCallDescription?: string;
  duration?: string | null;
  showThreeDaysMessage: boolean;
  waitingTimeTitle?: string;
}

export const OnlineVisitHighlights = ({
  messengers,
  safeCallDescription,
  duration,
  showThreeDaysMessage,
  waitingTimeTitle,
}: OnlineVisitHighlightsProps) => {
  const bullets: string[] = [
    'تضمین بازپرداخت مبلغ ویزیت در صورت نارضایتی',
    ...(duration ? [`مدت زمان گفتگو: <strong>${duration}</strong>`] : []),
    ...(showThreeDaysMessage ? ['تا <strong>۳ روز</strong> می‌توانید هر سوالی دارید از پزشک بپرسید'] : []),
    ...(waitingTimeTitle
      ? [`طبق نظر بیماران قبلی، میانگین زمان انتظار ویزیت: <strong>${waitingTimeTitle}</strong>`]
      : []),
    ...(safeCallDescription ? [safeCallDescription] : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {messengers.length > 0 && (
        <div className="mx-4 rounded-xl border border-primary/15 bg-primary/5 px-3 py-3">
          <ChannelDetailes messengers={messengers} title="ویزیت آنلاین در:" emphasized className="flex-wrap gap-2" />
        </div>
      )}
      <ServiceBulletList items={bullets} tone="enhanced" />
    </div>
  );
};

export default OnlineVisitHighlights;
