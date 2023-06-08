import { ReactElement, useEffect, useState } from 'react';

import { useInquiryPayment } from '@/common/apis/services/auth/premium/inquiryPayment';
import Button from '@/common/components/atom/button/button';
import Loading from '@/common/components/atom/loading';
import Text from '@/common/components/atom/text';
import ErrorIcon from '@/common/components/icons/error';
import SuccessIcon from '@/common/components/icons/success';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { splunkInstance } from '@/common/services/splunk';
import convertTimeStampToFormattedTime from '@/common/utils/convertTimeStampToFormattedTime';
import { getPremiumDuration } from '@/modules/bamdad/utils/getPremiumDuration';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import ReactCanvasConfetti from 'react-canvas-confetti';

export const Premium = () => {
  const router = useRouter();
  const id = router.query?.id as string;
  const inquiry = useInquiryPayment({
    id,
  });
  const [fire, setFire] = useState<boolean | number>(false);

  const isSuccess = inquiry.data?.data?.success;

  useEffect(() => {
    if (isSuccess) {
      setFire(Math.random());
      splunkInstance().sendEvent({
        group: 'bamdad',
        type: 'after_buy',
      });
    }
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
              <div>{isSuccess ? <SuccessIcon className="text-green-600" /> : <ErrorIcon className="text-red-600" />}</div>
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
                    اشتراک ماهانه طلایی پذیرش24 برای شما فعال گردید
                  </Text>
                ) : (
                  <Text fontSize="sm" fontWeight="medium">
                    اشتراک ماهانه طلایی پذیرش24 برای شما فعال نشد
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
