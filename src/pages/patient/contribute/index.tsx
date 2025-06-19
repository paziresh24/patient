/* eslint-disable @next/next/no-img-element */
import Button from '@/common/components/atom/button';
import Checkbox from '@/common/components/atom/checkbox';
import CloseIcon from '@/common/components/icons/close';
import DislikeIcon from '@/common/components/icons/dislike';
import LikeIcon from '@/common/components/icons/like';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { usePageViewEvent } from '@/common/hooks/usePageViewEvent';
import Text from '@/components/atom/text';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import heart from '@/modules/contribute/images/heart.svg';
import heroVector from '@/modules/contribute/images/hero.svg';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const [isChecked, setIsChecked] = useState(false);
  const profileData = useProfileDataStore(state => state.data);

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
      <Seo title="مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی" noIndex />

      <main className="flex flex-col items-center justify-between p-5 mx-auto md:max-w-md pb-36">
        <div className="flex flex-col space-y-5">
          <CloseIcon onClick={router.back} />

          <Text className="!mt-11 mx-auto text-[#1B268D] text-center" fontSize="xl" fontWeight="bold">
            به بقیه بیماران برای یافتن پزشک کمک کنید.
          </Text>

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

          <img src={heroVector.src} alt="پذیرش24-درمان" className="self-center" />

          <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-600">
            از صمیم قلب از کمک شما ممنونیم.
            <img src={heart.src} alt="" className="inline-block mr-2" width={25} />
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

export const getServerSideProps = withCSR(
  withServerUtils(async () => {
    return {
      props: {},
    };
  }),
);

export default Home;
