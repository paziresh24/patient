import PhoneIcon from '@/common/components/icons/phone';
import StatusIcon from '@/common/components/icons/status';
import { addCommas } from '@persian-tools/persian-tools';
import { ServiceCard } from './card';

interface OnlineVisitProps {
  title: string;
  channel: 'phone' | 'igap' | 'whatsapp' | 'eitaa';
  messengers?: string[];
  price?: number;
  duration?: string;
  onBook: () => void;
  loading?: boolean;
}

export const OnlineVisit = (props: OnlineVisitProps) => {
  const { title, channel, messengers, price, duration, onBook, loading } = props;
  return (
    <ServiceCard
      header={{
        title,
        icon: channel === 'phone' ? <PhoneIcon width={21} height={21} /> : <StatusIcon />,
        ...(price && { hint: `${addCommas(price / 10)} تومان` }),
      }}
      body={{
        description: [
          messengers && `ویزیت در پیام رسان های : <strong>${messengers?.join('، ')}</strong>`,
          duration && `مدت زمان گفتگو: <strong>${duration}</strong>`,
        ].filter(Boolean),
      }}
      footer={{
        actions: [
          {
            text: 'رزرو گفتگو',
            onClick: onBook,
            loading: loading,
          },
        ],
      }}
    />
  );
};

export default OnlineVisit;
