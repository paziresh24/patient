import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { splunkInstance } from '@/common/services/splunk';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';
import config from 'next/config';
import { useCallback } from 'react';
const { publicRuntimeConfig } = config();

export const OwnPage = ({ fullname }: { fullname: string }) => {
  const { info, isLogin } = useUserInfoStore();
  const ownPageTitle = useFeatureValue<any>('profile.own_page_text', '');

  const handleClick = useCallback(() => {
    splunkInstance().sendEvent({
      group: 'register',
      type: 'doctor-profile',
      event: {
        data: {
          action: 'click',
          current_url: location.href,
          phone_number: isLogin ? info.cell : null,
        },
      },
    });
    location.assign(`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}/auth/?q=profile`);
  }, [info, isLogin]);

  return (
    <div className="flex flex-col p-4 space-y-3 bg-white md:rounded-lg">
      <Text fontWeight="medium">{ownPageTitle ?? ''}</Text>
      <Button onClick={handleClick} variant="secondary">
        من {fullname} هستم
      </Button>
    </div>
  );
};

export default OwnPage;
