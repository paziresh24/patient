/* eslint-disable @next/next/no-img-element */
import Button from '@/common/components/atom/button';
import Checkbox from '@/common/components/atom/checkbox';
import CloseIcon from '@/common/components/icons/close';
import DislikeIcon from '@/common/components/icons/dislike';
import LikeIcon from '@/common/components/icons/like';
import { usePageViewEvent } from '@/common/hooks/usePageViewEvent';
import Text from '@/components/atom/text';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import heart from '@/modules/contribute/images/heart.svg';
import heroVector from '@/modules/contribute/images/hero.svg';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import clsx from 'clsx';
import randomNumber from 'lodash/random';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const [isChecked, setIsChecked] = useState(false);
  const [version, setVersion] = useState<string>('old');
  const profileData = useProfileDataStore(state => state.data);
  const sendPageViewEvent = usePageViewEvent();
  const isTestDoctor =
    profileData.group_expertises?.[0].en_slug === 'pediatrics' && profileData.centers?.some(center => center.city === 'یزد');

  useEffect(() => {
    if (!isLoading) {
      randomNumber(0, 1) === 1 && setVersion('new');
      isTestDoctor &&
        router.replace({
          query: { ...router.query, onboarding_group: version == 'new' ? 'aban_10' : 'mehr' },
        });
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
            expertise: profileData.expertises?.[0].expertise?.name,
            group_expertises: profileData.group_expertises?.[0]?.name,
          },
          center: {
            city: profileData.centers?.map(center => center.city),
            province: profileData.centers?.map(center => center.province),
          },
        },
      });
    }
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

          <Text
            className={clsx({
              '!mt-11 mx-auto text-[#1B268D]': version === 'old',
              '!mt-11 mx-auto text-[#1B268D] text-center': version === 'new',
            })}
            fontSize={version === 'new' ? 'xl' : '3xl'}
            fontWeight="bold"
          >
            {version === 'new' ? 'به بقیه بیماران برای یافتن پزشک کمک کنید.' : 'اینجا کجاست؟'}
          </Text>
          {version === 'new' && (
            <>
              <Text fontWeight="medium" fontSize="sm" className="text-right	 line-height-4 text-slate-600 !leading-7 flex">
                اگر از نظر شما آدرس یا شماره تلفن مطب پزشک صحیح است به ما تایید دهید.
                <div>
                  <LikeIcon />
                </div>
              </Text>
              <Text fontWeight="medium" fontSize="sm" className="text-right	 line-height-4 text-slate-600 !leading-7 !mt-0  flex">
                در غیر این صورت شماره تماس و آدرس صحیح پزشک را اعلام کنید.
                <div>
                  <DislikeIcon className="mt-2" />
                </div>
              </Text>
            </>
          )}
          {version === 'old' && (
            <Text fontWeight="medium" fontSize="sm" className="text-center line-height-4 text-slate-600 !leading-7">
              در اینجا شما می توانید در صورت عدم ثبت و یا نادرست بودن اطلاعات پزشک، با گزارش شماره تلفن و آدرس صحیح، به بیماران دیگر کمک
              کنیتا دسترسی راحت‌تری به پزشک‌‌شان داشته باشند.
            </Text>
          )}

          <div className="text-center space-s-2">
            {version === 'old' && (
              <>
                <Text fontSize="sm" fontWeight="medium" className="leading-7 text-center text-primary">
                  این همکاری شما، باعث کاهش زمان درد و رنج سایر بیماران میشود.
                </Text>
                <img src={heart.src} alt="" className="inline-block" width={25} />
              </>
            )}
          </div>
          <img src={heroVector.src} alt="پذیرش24-درمان" className="self-center" />

          <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-600">
            {version === 'new' ? 'از صمیم قلب از کمک شما ممنونیم.' : 'پیشاپیش، از همدلی و همراهی شما صمیمانه سپاسگزاریم.'}
            {version === 'new' && <img src={heart.src} alt="" className="inline-block mr-2" width={25} />}
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
