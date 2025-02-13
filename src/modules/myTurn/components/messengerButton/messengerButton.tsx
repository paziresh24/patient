import Button from '@/common/components/atom/button';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { OnlineVisitChannel } from '../turn/turnType';

export const MessengerButton = ({ channel, colorFull }: { channel: OnlineVisitChannel; colorFull?: Boolean }) => {
  const messengers = useFeatureValue<any>('onlinevisitchanneltype', {});
  const buttonType = useFeatureValue('receipt:messenger-button-type', 'OUTLINE');
  if (!channel || (!colorFull && buttonType === 'COLOR_FULL')) return null;
  return (
    <div className="flex flex-col w-full gap-3">
      {buttonType === 'OUTLINE' && !colorFull && (
        <Button
          variant="secondary"
          block={true}
          onClick={() => {
            splunkInstance('booking').sendEvent({
              group: 'link-visit-online',
              type: channel.type,
              event: {
                button_type: 'OUTLINE',
              },
            });
            window.open(channel?.channel_link);
          }}
          icon={<img src={messengers[channel?.type]?.image} width={24} height={24} alt="" className="ml-1" />}
        >
          شروع گفتگو در {messengers[channel?.type]?.text}
        </Button>
      )}
      {buttonType === 'SOLID' && !colorFull && (
        <Button
          variant="primary"
          block={true}
          onClick={() => {
            splunkInstance('booking').sendEvent({
              group: 'link-visit-online',
              type: channel.type,
              event: {
                button_type: 'SOLID',
              },
            });
            window.open(channel?.channel_link);
          }}
        >
          شروع گفتگو در {messengers[channel?.type]?.text}
        </Button>
      )}
      {buttonType === 'COLOR_FULL' && colorFull && (
        <Button
          variant="secondary"
          block={true}
          size="sm"
          className={classNames({
            'border-green-500/50 !text-green-500 hover:bg-green-500/5': channel.type === 'whatsapp',
            'border-orange-500/50 !text-orange-500 hover:bg-orange-500/5': channel.type === 'eitaa',
          })}
          onClick={() => {
            splunkInstance('booking').sendEvent({
              group: 'link-visit-online',
              type: channel.type,
              event: {
                button_type: 'COLOR_FULL',
              },
            });
            window.open(channel?.channel_link);
          }}
          icon={<img src={messengers[channel?.type]?.image} width={24} height={24} alt="" className="ml-1" />}
        >
          شروع گفتگو در {messengers[channel?.type]?.text}
        </Button>
      )}
    </div>
  );
};

export default MessengerButton;
