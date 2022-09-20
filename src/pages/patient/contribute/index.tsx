/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useRouter } from 'next/router';

import Text from '@/components/atom/text';

import Back from '@/common/components/atom/back';
import Button from '@/common/components/atom/button';
import Checkbox from '@/common/components/atom/checkbox';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import heart from '@/modules/contribute/images/heart.svg';
import heroVector from '@/modules/contribute/images/hero.svg';
import { useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const [isChecked, setIsChecked] = useState(false);

  const handleNextPage = () => {
    router.push({
      pathname: '/patient/contribute/menu',
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
          <Back />
          <Text className="!mt-24 mx-auto text-[#1B268D]  " fontSize="3xl" fontWeight="bold">
            اینجا کجاست ؟
          </Text>
          <Text fontWeight="medium" fontSize="sm" className="text-center  line-height-4 text-slate-600 !leading-7 ">
            در اینجا شما می توانید در صورت عدم ثبت و یا نادرست بودن اطلاعات پزشک، با گزارش شماره تلفن و آدرس صحیح، به بیماران دیگر کمک کنید
            تا دسترسی راحت‌تری به پزشک‌‌شان داشته باشند.
          </Text>

          <div className="flex items-center space-s-2">
            <Text fontSize="sm" fontWeight="medium" className="text-center text-primary leading-7">
              این همکاری شما، باعث کاهش زمان درد و رنج سایر بیماران میشود.
              <img src={heart.src} alt="" className=" inline-block" width={25} />
            </Text>
          </div>
          <img src={heroVector.src} alt="پذیرش24-درمان" className="self-center" />

          <Text fontSize="sm" className="text-center text-slate-500">
            پیشاپیش، از همدلی و همراهی شما صمیمانه سپاسگزاریم.
          </Text>
        </div>

        <Checkbox
          label="متوجه شدم "
          classNameWrapper="flex justify-center mt-28"
          labelName="agree"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />

        <div className="flex   justify-between gap-3  md:max-w-md fixed bottom-0 w-full p-5">
          <Button disabled={!isChecked} variant="primary" onClick={handleNextPage} loading={isLoading} className="flex-1">
            قصد کمک دارم
          </Button>

          <Button variant="secondary" onClick={router.back} className="flex-1">
            انصراف
          </Button>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
