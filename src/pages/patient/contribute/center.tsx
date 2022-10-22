/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Button from '@/common/components/atom/button';
import AppBar from '@/components/layouts/appBar';

import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { usePageViewEvent } from '@/common/hooks/usePageViewEvent';
import { Center } from '@/common/types/doctorParams';
import { AddressSection } from '@/modules/contribute/components/centerSections/address';
import PhoneNumberSection from '@/modules/contribute/components/centerSections/phoneNumber';
import { CenterInfoData } from '@/modules/contribute/components/editCenterInfo';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import { useInfoVote } from '@/modules/contribute/hooks/useInfoVote';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { PhoneNumbers } from '@/modules/contribute/types/phoneNumber';

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const profileData = useProfileDataStore(state => state.data);
  const [selectedCenter, setSelectedCenter] = useState<Center>();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumbers>([]);
  const [addresses, setAddresses] = useState<CenterInfoData[]>([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { like: phoneLike, dislike: phoneDislike, submit: phoneSubmit } = useInfoVote('phone_number');
  const { like: addressLike, dislike: addressDislike, submit: addressSubmit } = useInfoVote('address');

  const sendPageViewEvent = usePageViewEvent();

  useEffect(() => {
    if (!isLoading && profileData && router.query?.center_id) {
      sendPageViewEvent({
        group: 'contribute',
        type: 'center_report',
        data: {
          doctor: {
            id: profileData.id,
            server_id: profileData.server_id,
            name: profileData.name,
            family: profileData.family,
            slug: profileData.slug,
          },
        },
      });

      const center = profileData.centers?.find(center => center.id === router.query?.center_id);

      setSelectedCenter(center);
      setPhoneNumbers(center?.display_number_array?.map(item => ({ cell: item, default: true })) ?? []);
      setAddresses([
        {
          address: center?.address,
          city: center?.city,
          province: center?.province,
          lat: center?.map?.lat,
          lng: center?.map?.lon,
          default: true,
        },
      ]);
    }
  }, [isLoading, profileData, router.query]);

  const onSubmit = () => {
    phoneNumbers.forEach(
      item =>
        item.status &&
        (item.status === 'like' ? phoneLike(item.cell) : item.status === 'add' ? phoneSubmit(item.cell) : phoneDislike(item.cell)),
    );
    addresses.forEach(
      item =>
        item.status &&
        (item.status === 'like'
          ? addressLike(item.address)
          : item.status === 'add'
          ? addressSubmit(item.address)
          : addressDislike(item.address)),
    );
    setIsButtonLoading(true);
    router.replace({
      pathname: '/patient/contribute/thank-you',
      query: { ...router.query },
    });
  };

  return (
    <div>
      <Head>
        <title>اطلاعات مرکز درمانی {profileData.display_name}</title>
      </Head>

      <AppBar title={`اطلاعات مرکز درمانی ${profileData.display_name}`} backButton titleLoading={isLoading} />
      <main className="flex flex-col p-5 mx-auto space-y-4 md:max-w-md pb-28">
        {selectedCenter?.center_type ? (
          <>
            <div className="flex flex-col space-y-1">
              <Text fontSize="sm" className="opacity-80">
                نام مرکز
              </Text>
              <Text fontWeight="medium">{selectedCenter?.name}</Text>
            </div>
            <Divider />
            <PhoneNumberSection phoneNumbers={phoneNumbers} setPhoneNumbers={setPhoneNumbers} />
            <Divider />
            <AddressSection
              addresses={addresses}
              setAddresses={setAddresses}
              defaultAddress={{
                address: selectedCenter?.address,
                city: selectedCenter?.city,
                province: selectedCenter?.province,
                lat: selectedCenter?.map?.lat,
                lng: selectedCenter?.map?.lon,
              }}
            />
            <Divider />
          </>
        ) : (
          <FormLoading />
        )}

        <div className="fixed bottom-0 right-0 w-full p-4 bg-white shadow-lg md:bg-transparent md:static md:px-0 md:shadow-none">
          <Button variant="primary" className="w-full" loading={isButtonLoading} onClick={onSubmit}>
            ثبت
          </Button>
        </div>
      </main>
    </div>
  );
};
const FormLoading = () => {
  return (
    <>
      <Skeleton w="6rem" h="1rem" rounded="full" />
      <Skeleton w="100%" h="3rem" rounded="lg" />
      <Skeleton w="6rem" h="1rem" rounded="full" />
      <Skeleton w="100%" h="3rem" rounded="lg" />
      <Divider />
      <Skeleton w="6rem" h="1rem" rounded="full" />
      <div className="flex space-s-2">
        <Skeleton w="100%" h="3rem" rounded="lg" />
        <Skeleton w="3.5rem" h="3rem" rounded="lg" />
      </div>
      <Skeleton w="8rem" h="3rem" rounded="lg" />
      <Divider />
      <Skeleton w="6rem" h="1rem" rounded="full" />
      <div className="flex space-s-2">
        <Skeleton w="100%" h="3rem" rounded="lg" />
        <Skeleton w="3.5rem" h="3rem" rounded="lg" />
      </div>
      <div className="flex space-s-2">
        <Skeleton w="100%" h="3rem" rounded="lg" />
        <Skeleton w="3.5rem" h="3rem" rounded="lg" />
      </div>
      <Skeleton w="8rem" h="3rem" rounded="lg" />
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
