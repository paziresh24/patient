import PhoneIcon from '@/common/components/icons/phone';
import StatusIcon from '@/common/components/icons/status';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { addCommas } from '@persian-tools/persian-tools';
import isEmpty from 'lodash/isEmpty';
import { renderToString } from 'react-dom/server';
import { ServiceCard } from './card';
import ChannelDetailes from './channelDetailes';

interface OnlineVisitProps {
  title: string;
  channels?: string[];
  price?: number;
  duration?: string;
  onBook: () => void;
  loading?: boolean;
}

export const OnlineVisit = (props: OnlineVisitProps) => {
  const { title, channels, price, duration, onBook, loading } = props;
  const channelType = useFeatureValue<any>('onlinevisitchanneltype', []);
  const channelDetailes = channels?.length && channels.map((key: string) => channelType[key]);

  return (
    <ServiceCard
      header={{
        title,
        icon: channels?.length ? <StatusIcon /> : <PhoneIcon width={21} height={21} />,
        ...(price && { hint: `${addCommas(price / 10)} تومان` }),
      }}
      body={{
        description: [
          channels?.length && !isEmpty(channelType)
            ? renderToString(<ChannelDetailes messengers={channelDetailes} title="ویزیت در پیام رسان های:" />)
            : '',
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
