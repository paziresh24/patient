import Button from '@/common/components/atom/button';
import ChatIcon from '@/common/components/icons/chat';
import { OnlineVisitChannels } from '../turn/turnType';

export const MassengerButton = ({ channels }: { channels: OnlineVisitChannels }) => {
  if (!channels) return null;
  const channelsText = {
    igap: 'آی گپ',
    whatsapp: 'واتس اپ',
  };
  const channel = channels?.[0];
  if (!channel) return null;
  return (
    <Button variant="secondary" block={true} onClick={() => window.open(channel?.channel_link)} icon={<ChatIcon />}>
      گفتگو با پزشک در {channelsText[channel?.type]}
    </Button>
  );
};

export default MassengerButton;
