/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Text from '@/components/atom/text';
import CenterIcon from '@/components/icons/center';
import AppBar from '@/components/layouts/appBar';

import Skeleton from '@/common/components/atom/skeleton';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { usePageViewEvent } from '@/common/hooks/usePageViewEvent';
import { Center } from '@/common/types/doctorParams';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import officeVector from '@/modules/contribute/images/office.svg';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const profileData = useProfileDataStore(state => state.data);
  const sendPageViewEvent = usePageViewEvent();

  const centers = profileData?.centers?.filter(({ id }) => id !== '5532') ?? [];

  const handleClickCenter = (center: Center) => {
    router.push({
      pathname: '/patient/contribute/center/',
      query: { ...router.query, center_id: center.id },
    });
  };

  useEffect(() => {
    router.prefetch('/patient/contribute/center/');
  }, []);

  return (
    <div>
      <Seo title={`پیشخوان ${profileData.display_name}`} noIndex />

      <AppBar title={`پیشخوان ${profileData.display_name}`} titleLoading={isLoading} backButton />
      <main className="flex flex-col items-center p-5 mx-auto md:max-w-md">
        <div className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-s-2">
              <CenterIcon />
              <Text fontWeight="bold">ویرایش اطلاعات مرکز درمانی</Text>
            </div>
            <Text fontSize="sm" className="text-slate-500">
              در این قسمت شما می توانید آدرس و شماره تماس پیشنهادی برای هر یک از مراکز درمانی پزشک را ثبت کنید.
            </Text>
          </div>
          {isLoading ? (
            <MneuItemLoading />
          ) : (
            <div className="flex flex-col mt-5 space-y-3">
              {centers.map(center => (
                <div
                  key={center.id}
                  className="flex items-center justify-between p-2 pr-3 bg-white border border-blue-100 rounded-lg shadow-sm cursor-pointer"
                  onClick={() => handleClickCenter(center)}
                >
                  <Text fontSize="sm" fontWeight="medium" className="line-clamp-1">
                    {center.name}
                    <Text fontSize="xs" className="text-slate-400">
                      {' '}
                      | {center.address}
                    </Text>
                  </Text>
                  <div className="bg-blue-100 rounded-md">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.0068 14.348C21.0068 14.7622 20.671 15.098 20.2568 15.098L9.68578 15.098L13.7119 19.1241C14.0048 19.417 14.0048 19.8918 13.7119 20.1847C13.419 20.4776 12.9441 20.4776 12.6512 20.1847L7.34479 14.8783C7.05189 14.5854 7.05189 14.1105 7.34479 13.8176L12.6512 8.51117C12.9441 8.21828 13.419 8.21828 13.7119 8.51117C14.0048 8.80407 14.0048 9.27894 13.7119 9.57183L9.68578 13.598L20.2568 13.598C20.671 13.598 21.0068 13.9337 21.0068 14.348Z"
                        fill="#3861FB"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* <Divider /> */}
          {/* <div className="flex flex-col space-y-2">
            <div className="flex items-center space-s-2">
              <InfoIcon />
              <Text fontWeight="bold">اطلاعات تکمیلی</Text>
            </div>
            <Text fontSize="sm" className="text-slate-500">
              در این قسمت شما می توانید نحوه دریافت نوبت از دکتر حسین ابراهیمی را با سایر بیماران به
              اشتراک بگذارید.
            </Text>
          </div>
          <div className="flex flex-col mt-5 space-y-3">
            <div className="flex items-center justify-between p-2 bg-white border border-blue-100 rounded-lg shadow-sm">
              <Text fontSize="sm" fontWeight="medium">
                شما چگونه از این پزشک نوبت گرفتید؟
              </Text>
              <div className="bg-blue-100 rounded-md">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.0068 14.348C21.0068 14.7622 20.671 15.098 20.2568 15.098L9.68578 15.098L13.7119 19.1241C14.0048 19.417 14.0048 19.8918 13.7119 20.1847C13.419 20.4776 12.9441 20.4776 12.6512 20.1847L7.34479 14.8783C7.05189 14.5854 7.05189 14.1105 7.34479 13.8176L12.6512 8.51117C12.9441 8.21828 13.419 8.21828 13.7119 8.51117C14.0048 8.80407 14.0048 9.27894 13.7119 9.57183L9.68578 13.598L20.2568 13.598C20.671 13.598 21.0068 13.9337 21.0068 14.348Z"
                    fill="#3861FB"
                  />
                </svg>
              </div>
            </div>
          </div> */}
        </div>
        <img src={officeVector.src} alt="" className="fixed bottom-10 -z-50" width={300} />
      </main>
    </div>
  );
};

const MneuItemLoading = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton w="100%" h="3rem" rounded="lg" />
      <Skeleton w="100%" h="3rem" rounded="lg" />
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
