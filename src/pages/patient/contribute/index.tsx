/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useRouter } from 'next/router';

import Text from '@/components/atom/text';

import Button from '@/common/components/atom/button';
import Checkbox from '@/common/components/atom/checkbox';
import AppBar from '@/common/components/layouts/appBar';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import heart from '@/modules/contribute/images/heart.svg';
import heroVector from '@/modules/contribute/images/hero.svg';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const [isChecked, setIsChecked] = useState(false);
  const profileData = useProfileDataStore(state => state.data);

  const handleNextPage = () => {
    router.push({
      pathname: '/patient/contribute/menu',
      query: { slug: router.query?.slug },
    });
  };

  return (
    <div
      className="h-screen"
      style={{
        background: 'linear-gradient(rgb(255 255 255) 35.36%, rgb(244, 248, 251) 62.04%)',
      }}
    >
      <Head>
        <title>مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی</title>
      </Head>
      <AppBar title={`پیشخوان ویرایش ${profileData.display_name}`} titleLoading={isLoading} backButton />
      <main className="md:max-w-md mx-auto flex flex-col items-center justify-between p-5 pb-36">
        <div className="flex flex-col space-y-5">
          <Text className="!mt-11 mx-auto text-[#1B268D]" fontSize="3xl" fontWeight="bold">
            اینجا کجاست؟
          </Text>
          <Text fontWeight="medium" fontSize="sm" className="text-center line-height-4 text-slate-600 !leading-7 ">
            در اینجا شما می توانید در صورت عدم ثبت و یا نادرست بودن اطلاعات پزشک، با گزارش شماره تلفن و آدرس صحیح، به بیماران دیگر کمک کنید
            تا دسترسی راحت‌تری به پزشک‌‌شان داشته باشند.
          </Text>

          <div className="space-s-2 text-center">
            <Text fontSize="sm" fontWeight="medium" className="text-center text-primary leading-7">
              این همکاری شما، باعث کاهش زمان درد و رنج سایر بیماران میشود.
            </Text>
            <img src={heart.src} alt="" className="inline-block" width={25} />
          </div>
          <img src={heroVector.src} alt="پذیرش24-درمان" className="self-center" />

          <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-600">
            پیشاپیش، از همدلی و همراهی شما صمیمانه سپاسگزاریم.
          </Text>
        </div>

        <div className="flex flex-col gap-3 md:max-w-md fixed bottom-0 w-full p-5">
          <Checkbox
            label="متوجه شدم "
            className="flex justify-center mb-2"
            labelName="agree"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <div className="flex justify-between space-s-3 w-full">
            <Button disabled={!isChecked} variant="primary" onClick={handleNextPage} loading={isLoading} className="flex-1">
              قصد کمک دارم
            </Button>

            <Button variant="secondary" onClick={router.back} className="flex-1">
              انصراف
            </Button>
          </div>
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
