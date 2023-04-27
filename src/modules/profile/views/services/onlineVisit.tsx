import PhoneIcon from '@/common/components/icons/phone';
import StatusIcon from '@/common/components/icons/status';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { addCommas } from '@persian-tools/persian-tools';
import isEmpty from 'lodash/isEmpty';
import { ServiceCard } from './card';
interface OnlineVisitProps {
  title: string;
  channel: string;
  messengers?: string[];
  price?: number;
  duration?: string;
  onBook: () => void;
  loading?: boolean;
}

export const OnlineVisit = (props: OnlineVisitProps) => {
  const { title, channel, messengers, price, duration, onBook, loading } = props;
  const channelType = useFeatureValue<any>('onlinevisitchanneltype', []);
  const channelDetailes = `<div class="flex justify-between"><span>ویزیت در پیام رسان های:</span><div class='flex justify-end gap-4'>${
    messengers?.length &&
    messengers
      .map((key: any) => channelType[key])
      .map(
        (messenger: any) =>
          `<div class='flex'><div class='flex items-center gap-2'><img src=${
            messenger?.img ?? ''
          } alt='icon' class='max-w-6 max-h-6' /><span>${messenger?.title ?? ''}</span></div></div>`,
      )
      .join('')
  }</div></div>`;

  return (
    <ServiceCard
      header={{
        title,
        icon: channel === 'phone' ? <PhoneIcon width={21} height={21} /> : <StatusIcon />,
        ...(price && { hint: `${addCommas(price / 10)} تومان` }),
      }}
      body={{
        description: [
          messengers?.length && !isEmpty(channelType) ? channelDetailes : '',
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
