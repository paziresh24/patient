import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { splunkInstance } from '@/common/services/splunk';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useCallback } from 'react';
import { useProfileDataStore } from '../../store/profileData';

export const OwnPage = () => {
  const { data } = useProfileDataStore();
  const { info, isLogin } = useUserInfoStore();

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
    location.assign('https://dr.paziresh24.com/auth/?q=profile');
  }, [info, isLogin]);

  return (
    <div className="flex flex-col p-4 space-y-3 bg-white md:rounded-lg">
      <Text fontWeight="medium">درخواست احراز هویت و دریافت مالکیت صفحه</Text>
      <Button onClick={handleClick} variant="secondary">
        من {data.display_name} هستم
      </Button>
    </div>
  );
};

export default OwnPage;
