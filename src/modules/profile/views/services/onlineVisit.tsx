import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import PhoneIcon from '@/common/components/icons/phone';
import StatusIcon from '@/common/components/icons/status';
import OnlineVisitDiscountFallback from '@/modules/bamdad/components/onlineVisitDiscountFallback';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { addCommas } from '@persian-tools/persian-tools';
import { useRouter } from 'next/router';
import { renderToString } from 'react-dom/server';
import ServiceCard from '../../components/serviceCard';
import { useProfileDataStore } from '../../store/profileData';
import ChannelDetailes, { Messenger } from './channelDetailes';
interface OnlineVisitProps {
  title: string;
  channels?: string[];
  price?: number;
  duration?: string;
  onBook: () => void;
  loading?: boolean;
  discountPercent?: number;
  isPremium?: boolean;
}

type channelType = {
  [key: string]: Messenger;
};

export const OnlineVisit = (props: OnlineVisitProps) => {
  const { title, channels, price, duration, onBook, loading, discountPercent, isPremium } = props;
  const channelType = useFeatureValue<channelType>('onlinevisitchanneltype', {});
  const safeCallModuleInfo = useFeatureValue<any>('online_visit_secure_call', {});
  const profileData = useProfileDataStore(state => state.data);
  const channelDetailes = channels?.length && channels.map((key: string) => channelType[key]);
  const router = useRouter();
  return (
    <ServiceCard
      header={{
        title,
        icon: channels?.length ? <StatusIcon /> : <PhoneIcon width={21} height={21} />,
        ...(price && {
          hint: (
            <div className="flex items-center space-s-2">
              {isPremium && (
                <div className="relative flex items-center justify-center">
                  <Text className="absolute text-white right-2">%{discountPercent}</Text>
                  <svg width="46" height="24" viewBox="0 0 46 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-inside-1_2819_35812" fill="white">
                      <path d="M0.768746 4.99881C-0.958341 3.0658 0.413706 0 3.00588 0H42.4638C44.1207 0 45.4638 1.34315 45.4638 3V21C45.4638 22.6569 44.1207 24 42.4638 24H3.00587C0.413701 24 -0.958341 20.9342 0.768746 19.0012L5.23822 13.9988C6.25538 12.8604 6.25538 11.1396 5.23822 10.0012L0.768746 4.99881Z" />
                    </mask>
                    <path
                      d="M0.768746 4.99881C-0.958341 3.0658 0.413706 0 3.00588 0H42.4638C44.1207 0 45.4638 1.34315 45.4638 3V21C45.4638 22.6569 44.1207 24 42.4638 24H3.00587C0.413701 24 -0.958341 20.9342 0.768746 19.0012L5.23822 13.9988C6.25538 12.8604 6.25538 11.1396 5.23822 10.0012L0.768746 4.99881Z"
                      fill="#CF0000"
                    />
                    <path
                      d="M5.23822 13.9988L5.98393 14.6651L5.23822 13.9988ZM5.23822 10.0012L4.49251 10.6675L5.23822 10.0012ZM0.768746 19.0012L0.0230358 18.3349L0.768746 19.0012ZM3.00588 1H42.4638V-1H3.00588V1ZM44.4638 3V21H46.4638V3H44.4638ZM42.4638 23H3.00587V25H42.4638V23ZM1.51446 19.6675L5.98393 14.6651L4.49251 13.3325L0.0230358 18.3349L1.51446 19.6675ZM5.98393 9.33492L1.51446 4.33254L0.0230358 5.66508L4.49251 10.6675L5.98393 9.33492ZM5.98393 14.6651C7.34015 13.1472 7.34015 10.8528 5.98393 9.33492L4.49251 10.6675C5.17062 11.4264 5.17062 12.5736 4.49251 13.3325L5.98393 14.6651ZM3.00587 23C1.27776 23 0.363063 20.9561 1.51446 19.6675L0.0230358 18.3349C-2.27974 20.9123 -0.450359 25 3.00587 25V23ZM44.4638 21C44.4638 22.1046 43.5684 23 42.4638 23V25C44.6729 25 46.4638 23.2091 46.4638 21H44.4638ZM42.4638 1C43.5684 1 44.4638 1.89543 44.4638 3H46.4638C46.4638 0.790861 44.6729 -1 42.4638 -1V1ZM3.00588 -1C-0.450351 -1 -2.27975 3.08774 0.0230358 5.66508L1.51446 4.33254C0.363065 3.04387 1.27776 1 3.00588 1V-1Z"
                      fill="#CF0000"
                      mask="url(#path-1-inside-1_2819_35812)"
                    />
                  </svg>
                </div>
              )}
              <Text as="del" className={isPremium ? 'text-red-500' : 'text-transparent'}>
                <Text className="text-slate-900" fontWeight="bold">
                  {addCommas(price / 10)} تومان
                </Text>
              </Text>
            </div>
          ),
        }),
      }}
      body={{
        description: [
          channels?.length && channelDetailes
            ? renderToString(<ChannelDetailes messengers={channelDetailes} title="ویزیت آنلاین در پیام رسان:" />)
            : '',
          duration && `مدت زمان گفتگو: <strong>${duration}</strong>`,
          safeCallModuleInfo?.doctors_id?.includes(profileData.id) && safeCallModuleInfo?.description,
        ].filter(Boolean),
      }}
      footer={{
        ...(!isPremium &&
          discountPercent && {
            component: <OnlineVisitDiscountFallback className="mt-3" />,
          }),
        actions: [
          {
            text: 'رزرو گفتگو',
            onClick: onBook,
            loading: loading,
            ...(isPremium && { className: '!shadow-amber-500/20 shadow-lg hover:shadow-xl transition-all ' }),
            ...(isPremium && { icon: <DiamondIcon /> }),
            ...(price && isPremium && discountPercent && { hint: `${addCommas((price - (price * discountPercent) / 100) / 10)} تومان` }),
          },
        ],
      }}
    />
  );
};

export default OnlineVisit;
