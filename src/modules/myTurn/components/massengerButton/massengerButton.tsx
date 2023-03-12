import Button from '@/common/components/atom/button';
import { massengers } from '@/common/constants/massengers';
import { OnlineVisitChannel } from '../turn/turnType';

export const MassengerButton = ({ channel }: { channel: OnlineVisitChannel }) => {
  if (!channel) return null;
  return (
    <Button
      variant="secondary"
      block={true}
      onClick={() => window.open(channel?.channel_link)}
      icon={<img src={massengers[channel?.type]?.icon} width={24} height={24} alt="" className="ml-1" />}
    >
      شروع گفتگو با پزشک در {massengers[channel?.type].name}
    </Button>
  );
};

export default MassengerButton;
