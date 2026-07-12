import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import VerifyIcon from '@/common/components/icons/verify';
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
    location.assign(`https://providers.paziresh24.com/`);
  }, [info, isLogin]);

  return (
    <div className="mx-4 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:mx-0 md:p-5 md:shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <VerifyIcon width={22} height={22} />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <Text fontWeight="bold" className="text-base leading-6">
            {ownPage?.title}
          </Text>
          {ownPage?.description && (
            <Text fontSize="sm" className="leading-6 text-slate-600">
              {ownPage?.description?.replace('{fullname}', fullname)}
            </Text>
          )}
        </div>
      </div>
      <Button onClick={handleClick} variant="primary" className="w-full md:w-auto md:self-start">
        {ownPage?.buttonText?.replace('{fullname}', fullname)}
      </Button>
    </div>
  );
};

export default OwnPage;
