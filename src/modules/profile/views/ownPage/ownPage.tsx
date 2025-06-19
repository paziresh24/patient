import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { splunkInstance } from '@/common/services/splunk';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useCallback } from 'react';

export const OwnPage = ({ fullname }: { fullname: string }) => {
  const { info, isLogin } = useUserInfoStore();

  const ownPage = useFeatureValue('profile.own_page', {
    title: 'درخواست احراز هویت و دریافت مالکیت صفحه',
    buttonText: 'من {fullname} هستم',
    description: '',
  });

  const handleClick = useCallback(() => {
    splunkInstance('doctor-profile').sendEvent({
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
    location.assign(`https://www.paziresh24.com/home/intermediate-registration-form/`);
  }, [info, isLogin]);

  return (
    <div className="flex flex-col p-4 space-y-3 bg-white md:rounded-lg">
      <Text fontWeight="medium">{ownPage?.title}</Text>
      <Button onClick={handleClick} variant="secondary">
        {ownPage?.buttonText?.replace('{fullname}', fullname)}
      </Button>
      {ownPage?.description && (
        <Text fontSize="sm" fontWeight="medium" className="opacity-95">
          {ownPage?.description?.replace('{fullname}', fullname)}
        </Text>
      )}
    </div>
  );
};

export default OwnPage;
