import Button from '@/common/components/atom/button';
import { splunkBookingInstance } from '@/common/services/splunk';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { OnlineVisitChannel } from '../turn/turnType';

export const MessengerButton = ({ channel }: { channel: OnlineVisitChannel }) => {
  const messengers = useFeatureValue<any>('onlinevisitchanneltype', {});
  if (!channel) return null;
  return (
    <Button
      variant="secondary"
      block={true}
      onClick={() => {
        splunkBookingInstance().sendEvent({
          group: 'link-visit-online',
          type: channel.type,
        });
        window.open(channel?.channel_link);
      }}
      icon={<img src={messengers[channel?.type]?.image} width={24} height={24} alt="" className="ml-1" />}
    >
      شروع گفتگو با پزشک در {messengers[channel?.type]?.text}
    </Button>
  );
};

export default MessengerButton;
