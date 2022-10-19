/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useRouter } from 'next/router';

import Text from '@/components/atom/text';

import Button from '@/common/components/atom/button';
import Checkbox from '@/common/components/atom/checkbox';
import CloseIcon from '@/common/components/icons/close';
import { usePageViewEvent } from '@/common/hooks/usePageViewEvent';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import heart from '@/modules/contribute/images/heart.svg';
import heroVector from '@/modules/contribute/images/hero.svg';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useEffect, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const [isChecked, setIsChecked] = useState(false);
  const profileData = useProfileDataStore(state => state.data);

  const sendPageViewEvent = usePageViewEvent();

  useEffect(() => {
    !isLoading &&
      sendPageViewEvent({
        group: 'contribute',
        type: 'onboarding',
        data: {
          doctor: {
            id: profileData.id,
            name: profileData.name,
            family: profileData.family,
            slug: profileData.slug,
            server_id: profileData.server_id,
          },
        },
      });
  }, [isLoading]);

  const handleNextPage = () => {
    router.push({
      pathname: '/patient/contribute/menu',
      query: { ...router.query },
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

      <main className="flex flex-col items-center justify-between p-5 mx-auto md:max-w-md pb-36">
        <div className="flex flex-col space-y-5">
          <CloseIcon onClick={router.back} />

          <Text className="!mt-11 mx-auto text-[#1B268D]" fontSize="3xl" fontWeight="bold">
            اینجا کجاست؟
          </Text>
          <Text fontWeight="medium" fontSize="sm" className="text-center line-height-4 text-slate-600 !leading-7 ">
            در اینجا شما می توانید در صورت عدم ثبت و یا نادرست بودن اطلاعات پزشک، با گزارش شماره تلفن و آدرس صحیح، به بیماران دیگر کمک کنید
            تا دسترسی راحت‌تری به پزشک‌‌شان داشته باشند.
          </Text>

          <div className="text-center space-s-2">
            <Text fontSize="sm" fontWeight="medium" className="leading-7 text-center text-primary">
              این همکاری شما، باعث کاهش زمان درد و رنج سایر بیماران میشود.
            </Text>
            <img src={heart.src} alt="" className="inline-block" width={25} />
          </div>
          <img src={heroVector.src} alt="پذیرش24-درمان" className="self-center" />

          <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-600">
            پیشاپیش، از همدلی و همراهی شما صمیمانه سپاسگزاریم.
          </Text>
        </div>

        <div className="fixed bottom-0 flex flex-col w-full gap-3 p-5 md:max-w-md">
          <Checkbox
            label="متوجه شدم "
            className="flex justify-center mb-2"
            labelName="agree"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <div className="flex justify-between w-full space-s-3">
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
