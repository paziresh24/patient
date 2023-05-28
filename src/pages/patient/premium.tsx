import { ReactElement } from 'react';

import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text/text';
import CheckIcon from '@/common/components/icons/check';
import DiamondIcon from '@/common/components/icons/diamond';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useApplication from '@/common/hooks/useApplication';
import useWebView from '@/common/hooks/useWebView';
import demond from '@/modules/patient/assets/demond.png';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

export const Premium = () => {
  const { query } = useRouter();
  const isWebView = useWebView();
  const isApplication = useApplication();
  const { t } = useTranslation('patient/premium');

  const features = [
    {
      title: 'پشتیبانی  24 ساعته',
      discription: 'تیم پشتیبانی پذیرش 24 همیشه در دسترس و در کنار شما خواهد بود تا در مورد هر گونه سوال یا نگرانی به شما کمک کنند.',
    },
    {
      title: '%30 تخفیف نامحدود در  ویزیت های آنلاین',
      discription: 'با 30% تخفیف در تمام ویزیت های آنلاین، در هزینه های پزشکی خود صرفه جویی بیشتری کنید. ',
    },
    {
      title: 'دسترسی به خلاصه‌ی نظرات کاربران درباره‌ی پزشکان',
      discription:
        'هنگام انتخاب پزشک با دسترسی به نسخه خلاصه شده نظرات کاربران، تصمیم آگاهانه تری بگیرید و پزشک مناسبی را برای درمان خود انتخاب کنید.',
    },
    {
      title: 'مشاهده دلیل مراجعه سایر بیماران به یک پزشک',
      discription:
        'با مشاهده دلایلی که سایر بیماران یک پزشک خاص را انتخاب کرده اند، شما می توانید تشخیص دهید که پزشک برای درمان شما مناسب است یا خیر.',
    },
    {
      title: 'رزرو نوبت با  اولویت',
      discription:
        'با این ویژگی هرگز نوبت پزشک مورد نظر خود را از دست ندهید. اگر  در خواست رزو نوبت یک پزشک را ثبت کنید، به محض اعلام نوبت های جدید، پذیرش 24 یکی از نوبت ها را برای شما رزرو خواهد کرد.',
    },
  ];

  return (
    <>
      <Seo title={t('title')} noIndex />

      {(isWebView || isApplication) && (
        <AppBar title={t('title')} className="border-b border-slate-200" backButton={query.referrer === 'profile'} />
      )}

      <div className="relative flex flex-col items-center flex-grow p-5 bg-white pt-11 pb-24">
        <div className="relative flex flex-col border border-orange-200 items-center bg-gradient-to-tr from-yellow-400 via-amber-200 to-amber-300 after:bg-white after:content after:w-[99%] after:h-[97%] after:absolute after:rounded-md justify-center w-full p-5 space-y-1 rounded-lg before:-top-1 before:content before:absolute before:w-20 before:h-3 before:bg-white">
          <img src={demond.src} className="absolute z-20 -top-6 " />
          <Text fontWeight="bold" fontSize="lg" className="z-50">
            اشتراک طلایی
          </Text>
          <Text align="center" fontSize="sm" className="z-50">
            اشتراک ماهانه طلایی برای تجربه ای بهتر در ویزیت آنلاین و بهرمندی از سایر خدمات ویژه پذیرش 24
          </Text>
        </div>

        <div className="flex flex-col space-y-5 my-4">
          {features.map(item => (
            <div key={item.title} className="flex flex-col space-y-2">
              <div className="flex items-center space-s-1">
                <CheckIcon className="text-green-500" />
                <Text fontWeight="bold">{item.title}</Text>
              </div>
              <Text fontSize="sm" align="justify">
                {item.discription}
              </Text>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 w-full right-0 p-4 bg-white border-t-2 border-slate-100">
          <Button block icon={<DiamondIcon />} className="space-s-1">
            <div className="w-full flex justify-between">
              <span>خرید اشتراک طلایی</span>|<span>50,000 تومان</span>
            </div>
          </Button>
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
