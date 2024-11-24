/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';

import Text from '@/components/atom/text';

import Button from '@/common/components/atom/button';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { usePageViewEvent } from '@/common/hooks/usePageViewEvent';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import finalHero from '@/modules/contribute/images/finalHero.svg';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

const ThankYouPage = () => {
  const router = useRouter();
  const userData = useUserInfoStore(state => state.info);
  const { isLoading } = useGetData();
  const profileData = useProfileDataStore(state => state.data);

  const handleBackToMenu = () => {
    location.replace(`/dr/${router.query.slug}`);
  };

  return (
    <div className="h-screen overflow-auto bg-white">
      <Seo title="مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی" noIndex />

      <main
        className="flex flex-col justify-between p-5 pt-16 mx-auto md:max-w-md"
        style={{
          background: 'linear-gradient(rgb(244, 248, 251) 62.04%, #fffffff7 78.36%)',
        }}
      >
        <div className="flex flex-col justify-center space-y-5">
          <img src={finalHero.src} alt="" className="self-center" />
          <Text fontWeight="bold" className="text-center text-green-600">
            {isLoading ? '...' : userData.name} عزیز اطلاعات ارزشمند شما را دریافت کردیم.
          </Text>
          <div className="flex flex-col items-center justify-center p-5 space-y-3 bg-white rounded-3xl">
            <Text fontSize="sm" fontWeight="medium" className="text-justify">
              ما پر شور هستیم تا با کمک شما بتوانیم برای سایر بیماران دسترسی آسان و مطمئنی به پزشکان مختلف ایجاد کنیم . این یک مسئولیت
              اجتماعی مهم بود که شما به نحو احسن انجام دادید و به ارتقای کیفی و بهبود زندگی افراد جامعه کمک کردید.
            </Text>
            <Text fontWeight="medium" className="text-center text-primary">
              از همدلی و همراهی شما صمیمانه سپاسگزاریم.
            </Text>
          </div>
          <Text fontSize="xs" fontWeight="medium" className="text-center text-slate-600">
            اطلاعات ارسالی شما پس از تایید برای سایر بیماران نمایش داده میشود.
          </Text>
          <Button
            className="mt-12"
            onClick={handleBackToMenu}
            variant="text"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_711_3691)">
                  <path
                    d="M9.96094 19.9316C11.3216 19.9316 12.6026 19.6712 13.8037 19.1504C15.0049 18.6295 16.0645 17.9101 16.9824 16.9922C17.9004 16.0742 18.6198 15.0146 19.1406 13.8135C19.6615 12.6123 19.9219 11.3314 19.9219 9.9707C19.9219 8.61003 19.6615 7.3291 19.1406 6.12793C18.6198 4.92676 17.9004 3.86719 16.9824 2.94922C16.0645 2.03125 15.0033 1.31185 13.7988 0.791016C12.5944 0.270182 11.3119 0.00976562 9.95117 0.00976562C8.5905 0.00976562 7.30957 0.270182 6.1084 0.791016C4.90723 1.31185 3.84928 2.03125 2.93457 2.94922C2.01986 3.86719 1.30208 4.92676 0.78125 6.12793C0.260417 7.3291 0 8.61003 0 9.9707C0 11.3314 0.260417 12.6123 0.78125 13.8135C1.30208 15.0146 2.02148 16.0742 2.93945 16.9922C3.85742 17.9101 4.91699 18.6295 6.11816 19.1504C7.31933 19.6712 8.60026 19.9316 9.96094 19.9316Z"
                    fill="#3861FB"
                  />
                  <path
                    d="M4.95117 14.3164C4.81445 14.3164 4.6875 14.2562 4.57031 14.1357C4.45312 14.0153 4.39453 13.8379 4.39453 13.6035C4.39453 12.2689 4.58984 11.1166 4.98047 10.1465C5.3711 9.17644 5.97819 8.42936 6.80176 7.90527C7.62533 7.38118 8.6849 7.11914 9.98047 7.11914H10.1367V5.05859C10.1367 4.88281 10.1969 4.72981 10.3174 4.59961C10.4378 4.4694 10.5924 4.4043 10.7812 4.4043C10.9179 4.4043 11.0368 4.43522 11.1377 4.49707C11.2386 4.55891 11.3607 4.65494 11.5039 4.78516L15.7812 8.7793C15.8919 8.87695 15.9668 8.97461 16.0059 9.07227C16.045 9.16992 16.0645 9.26757 16.0645 9.36523C16.0645 9.45637 16.0433 9.55078 16.001 9.64844C15.9587 9.74609 15.8854 9.84375 15.7812 9.94141L11.5039 13.9648C11.3802 14.082 11.2614 14.1699 11.1475 14.2285C11.0336 14.2871 10.9082 14.3164 10.7715 14.3164C10.5892 14.3164 10.4378 14.2562 10.3174 14.1357C10.1969 14.0153 10.1367 13.8672 10.1367 13.6914V11.6211H9.98047C8.93229 11.6211 8.06152 11.7839 7.36816 12.1094C6.6748 12.4349 6.09049 13.0371 5.61523 13.916C5.5306 14.0918 5.42806 14.2025 5.30762 14.248C5.18717 14.2936 5.06836 14.3164 4.95117 14.3164Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_711_3691">
                    <rect width="19.9219" height="19.9316" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
          >
            بازگشت به پروفایل پزشک
          </Button>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async () => {
    return {
      props: {},
    };
  }),
);

export default ThankYouPage;
