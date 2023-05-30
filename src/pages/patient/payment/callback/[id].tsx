import { ReactElement, useEffect, useState } from 'react';

import { useInquiryPayment } from '@/common/apis/services/auth/premium/inquiryPayment';
import Button from '@/common/components/atom/button/button';
import Loading from '@/common/components/atom/loading';
import Text from '@/common/components/atom/text';
import ErrorIcon from '@/common/components/icons/error';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useApplication from '@/common/hooks/useApplication';
import useWebView from '@/common/hooks/useWebView';
import convertTimeStampToFormattedTime from '@/common/utils/convertTimeStampToFormattedTime';
import { getPremiumDuration } from '@/common/utils/getPremiumDuration';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import ReactCanvasConfetti from 'react-canvas-confetti';

export const Premium = () => {
  const router = useRouter();
  const resNum = router.query?.id as string;
  const isWebView = useWebView();
  const isApplication = useApplication();
  const { t } = useTranslation('patient/premium');
  const inquiry = useInquiryPayment({
    res_num: resNum,
  });
  const [fire, setFire] = useState<boolean | number>(false);

  const isSuccess = inquiry.data?.data?.success;

  useEffect(() => {
    if (isSuccess) setFire(Math.random());
  }, [isSuccess]);

  return (
    <>
      <Seo title="نتیجه پرداخت" noIndex />

      <ReactCanvasConfetti fire={fire} className="absolute z-30 w-full h-screen canvas" />
      <div className="flex flex-col flex-grow h-full bg-white">
        <div className="relative flex flex-col items-center justify-center flex-grow w-full p-5 pb-24 mx-auto bg-white md:max-w-md">
          {inquiry.isLoading && <Loading />}
          {inquiry.isSuccess && (
            <div className="z-40 flex flex-col items-center justify-center w-full p-3 space-y-3 text-center border rounded-lg border-slate-200">
              <div>
                {isSuccess ? (
                  <svg width="62" height="57" viewBox="0 0 62 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14">
                    <path
                      d="M46.1633 8.47143C46.9971 7.49842 46.8759 6.02265 45.8262 5.28773C41.157 2.01868 35.5898 0.172596 29.8241 0.0115099C23.2738 -0.171496 16.8536 1.83108 11.6096 5.69289C6.36569 9.5547 2.60717 15.0481 0.946596 21.2778C-0.713981 27.5075 -0.178717 34.1063 2.46516 39.9988C5.10903 45.8913 9.70565 50.7301 15.5059 53.7267C21.3062 56.7233 27.9682 57.7009 34.4062 56.5004C40.8443 55.2999 46.6788 51.9919 50.959 47.1155C54.7238 42.8264 57.0908 37.5462 57.7858 31.958C57.9438 30.6874 56.9385 29.6061 55.6592 29.5555C54.3824 29.5049 53.3176 30.5011 53.1403 31.7665C52.5012 36.3284 50.5339 40.6306 47.4516 44.1422C43.8551 48.2397 38.9525 51.0193 33.5427 52.0281C28.133 53.0369 22.5351 52.2154 17.6612 49.6974C12.7874 47.1794 8.92497 43.1135 6.70338 38.1622C4.48179 33.2108 4.03202 27.666 5.42737 22.4313C6.82271 17.1967 9.98091 12.5807 14.3873 9.33571C18.7937 6.09071 24.1884 4.40799 29.6925 4.56177C34.4381 4.69436 39.0237 6.18546 42.8969 8.82814C43.93 9.53306 45.3494 9.42115 46.1633 8.47143Z"
                      fill="#0BB07B"
                    />
                    <path
                      d="M58.0001 8.89597L29.6496 36.9017L16.7631 24.1718"
                      stroke="#0BB07B"
                      stroke-width="7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  <ErrorIcon className="text-red-600" />
                )}
              </div>
              {isSuccess ? (
                <Text fontWeight="bold" fontSize="lg" className="text-green-600">
                  پرداخت شما با موفقیت انجام شد
                </Text>
              ) : (
                <Text fontWeight="bold" fontSize="lg" className="text-red-600">
                  پرداخت شما با موفقیت انجام نشد
                </Text>
              )}

              <div className="w-full p-3 px-1 rounded-md bg-orange-50">
                {isSuccess ? (
                  <Text fontSize="sm" fontWeight="medium">
                    اشتراک ماهانه طلایی پذیرش 24 برای شما فعال گردید
                  </Text>
                ) : (
                  <Text fontSize="sm" fontWeight="medium">
                    اشتراک ماهانه طلایی پذیرش 24 برای شما فعال نشد
                  </Text>
                )}
              </div>
              {isSuccess && (
                <div className="flex flex-col w-full gap-2">
                  <div className="flex justify-between">
                    <Text>مدت اعتبار:</Text>
                    <Text>{getPremiumDuration(inquiry.data?.data?.expire)} روز</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>تاریخ تمدید:</Text>
                    <Text>
                      {new Date(inquiry.data?.data?.expire ?? '').toLocaleDateString('fa')}، ساعت{' '}
                      {convertTimeStampToFormattedTime(new Date(inquiry.data?.data?.expire ?? '').getTime())}
                    </Text>
                  </div>
                </div>
              )}

              {isSuccess ? (
                <Button block className="!mt-10" onClick={() => router.push('/')}>
                  بازگشت به سایت
                </Button>
              ) : (
                <div className="flex w-full space-s-2">
                  <Button block onClick={() => router.push('/patient/premium')}>
                    تلاش مجدد
                  </Button>
                  <Button block variant="secondary" onClick={() => router.push('/')}>
                    انصراف
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Premium.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showBottomNavigation={false} shouldShowPromoteApp={false} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Premium;
