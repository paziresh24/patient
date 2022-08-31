/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useRouter } from 'next/router';

import Text from '@/components/atom/text';

import Button from '@/common/components/atom/button';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import doctor from '@/modules/contribute/images/doctor.svg';
import heart from '@/modules/contribute/images/heart.svg';
import heroVector from '@/modules/contribute/images/hero.svg';
import idCard from '@/modules/contribute/images/idCard.svg';

const Home = () => {
  const router = useRouter();
  const { isLoading } = useGetData();

  const handleNextPage = () => {
    router.push({
      pathname: '/contribute/menu',
      query: { slug: router.query?.slug },
    });
  };

  return (
    <div>
      <Head>
        <title>مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی</title>
      </Head>

      <main
        className="md:max-w-md mx-auto flex flex-col items-center justify-between p-5 pb-36"
        style={{
          background: 'linear-gradient(180deg, #F4F8FB 62.04%, rgba(244, 248, 251, 0) 78.36%)',
        }}
      >
        <div className="flex flex-col space-y-5">
          <img src={heroVector.src} alt="" className="self-center" />
          <Text fontWeight="bold" className="text-center">
            با مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی، به 5 میلیون بیمارِ پذیرش 24 کمک کنید.
          </Text>
          <div className="flex items-center space-s-2">
            <img src={heart.src} alt="" className="-mt-5" width={25} />
            <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-500">
              شما می توانید با مشارکت در هر یک از موارد زیر، در کمک و یاری به دیگر بیماران قدمی بردارید.
            </Text>
          </div>
          <div className="bg-white shadow-xl shadow-blue-50 flex flex-col rounded-2xl p-6 space-y-4">
            <div className="flex space-s-4">
              <img src={idCard.src} className="w-7 h-7" alt="" />
              <div className="flex flex-col space-y-2">
                <Text fontWeight="semiBold" fontSize="sm">
                  اطلاعات پزشک مورد نظر خود را بروز کنید
                </Text>
                <Text fontWeight="light" fontSize="sm" className="text-slate-500">
                  شما می توانید اطلاعات تماس و آدرس مرکز درمانی پزشک مورد نظر خود را ویرایش کنید.
                </Text>
              </div>
            </div>
            <div className="flex space-s-4">
              <img src={doctor.src} className="w-7 h-7" alt="" />
              <div className="flex flex-col space-y-2">
                <Text fontWeight="semiBold" fontSize="sm">
                  گزارش روش های دریافت نوبت
                </Text>
                <Text fontWeight="light" fontSize="sm" className="text-slate-500">
                  شما می توانید روش های دریافت نوبت از پزشک مورد نظرتان را با دیگر بیماران به اشتراک بگذارید.
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="md:max-w-md fixed bottom-0 w-full p-5">
          <Button block variant="primary" onClick={handleNextPage} loading={isLoading}>
            متوجه شدم
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;
