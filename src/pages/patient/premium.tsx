/* eslint-disable @next/next/no-img-element */
import { ReactElement } from 'react';

import { usePremiumPayment } from '@/common/apis/services/auth/premium/payment';
import Button from '@/common/components/atom/button/button';
import Loading from '@/common/components/atom/loading/loading';
import Text from '@/common/components/atom/text/text';
import CheckIcon from '@/common/components/icons/check';
import DiamondIcon from '@/common/components/icons/diamond';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useApplication from '@/common/hooks/useApplication';
import useWebView from '@/common/hooks/useWebView';
import convertTimeStampToFormattedTime from '@/common/utils/convertTimeStampToFormattedTime';
import diamond from '@/modules/bamdad/assets/diamond.png';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import { getPremiumDuration } from '@/modules/bamdad/utils/getPremiumDuration';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { addCommas } from '@persian-tools/persian-tools';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

export const Premium = () => {
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const isUserPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const { query } = useRouter();
  const isWebView = useWebView();
  const isApplication = useApplication();
  const { t } = useTranslation('patient/premium');
  const featureList = useFeatureValue<Array<{ title: string; description: string }>>('premium.feature_list', []);
  const price = useFeatureValue<number>('premium.pricing', 0);

  const payment = usePremiumPayment();

  const handlePayment = async () => {
    if (!isLogin && !isUserPending) {
      handleOpenLoginModal({
        state: true,
      });
      return;
    }

    const { data } = await payment.mutateAsync();
    window.location.assign(data.url);
  };

  return (
    <>
      <Seo title={t('title')} noIndex />

      {(isWebView || isApplication) && (
        <AppBar title={t('title')} className="border-b border-slate-200" backButton={query.referrer === 'profile'} />
      )}
      <div className="flex flex-col flex-grow h-full bg-white">
        {isUserPending && (
          <div className="flex flex-col items-center justify-center flex-grow">
            <Loading className="w-11 h-11 fill-amber-500" />
          </div>
        )}
        {!isUserPending && (
          <div className="relative flex flex-col items-center flex-grow p-5 pb-24 mx-auto bg-white border-dashed border-slate-200 md:border-x md:max-w-md pt-11">
            <div className="relative flex flex-col border border-orange-200 items-center bg-gradient-to-tr from-yellow-400 via-amber-200 to-amber-300 after:bg-white after:content after:w-[98%] after:h-[97%] after:absolute after:rounded-md justify-center w-full p-3 space-y-1 rounded-lg before:-top-1 before:content before:absolute before:w-20 before:h-3 before:bg-white">
              <div className="absolute z-20 w-12 h-12 transition-all bg-amber-500 blur-2xl -top-6 animate-bounce" />
              <img src={diamond.src} alt="" className="absolute z-20 -top-6 animate-bounce-slow" />
              <Text fontWeight="bold" fontSize="lg" className="z-40 !mt-5">
                اشتراک طلایی
              </Text>
              {checkPremiumUser(user.vip) && (
                <Text align="center" fontSize="sm" className="z-40">
                  شما دارای اشتراک طلایی هستید
                </Text>
              )}
              {!checkPremiumUser(user.vip) && (
                <Text align="center" fontSize="sm" className="z-40 px-5 py-2 leading-6">
                  اشتراک ماهانه طلایی برای تجربه ای بهتر در ویزیت آنلاین و بهرمندی از سایر خدمات ویژه پذیرش24
                </Text>
              )}

              {checkPremiumUser(user.vip) && (
                <div className="z-40 flex flex-col w-full gap-2 bg-amber-50 p-2 px-3 rounded-md !mt-4 text-sm">
                  <div className="flex justify-between">
                    <Text>مدت اعتبار:</Text>
                    <Text fontWeight="medium">{getPremiumDuration(user.vip)} روز</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>تاریخ تمدید:</Text>
                    <Text fontWeight="medium">
                      {new Date(user.vip ?? '').toLocaleDateString('fa')}، ساعت{' '}
                      {convertTimeStampToFormattedTime(new Date(user.vip ?? '').getTime())}
                    </Text>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col my-4 space-y-5">
              {featureList?.map?.(item => (
                <div key={item.title} className="flex flex-col space-y-2">
                  <div className="flex items-center space-s-1">
                    <CheckIcon className="text-green-500" />
                    <Text fontWeight="bold">{item.title}</Text>
                  </div>
                  <Text fontSize="sm" align="justify">
                    {item.description}
                  </Text>
                </div>
              ))}
            </div>
            {!checkPremiumUser(user.vip) && (
              <div className="fixed bottom-0 right-0 w-full p-4 bg-white border-t-2 md:static border-slate-100">
                <Button onClick={handlePayment} block icon={<DiamondIcon />} className="space-s-1" loading={payment.isLoading}>
                  <div className="flex justify-between w-full">
                    <span>خرید اشتراک طلایی</span>|<span>{addCommas(price)} تومان</span>
                  </div>
                </Button>
              </div>
            )}
          </div>
        )}
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
