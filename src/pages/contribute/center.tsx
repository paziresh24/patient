/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from 'cookies-next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import Skeleton from '@/common/components/atom/skeleton';
import TextField from '@/common/components/atom/textField';
import { splunkInstance } from '@/common/services/splunk';
import TopBar from '@/components/layouts/appBar';

import { AddressSection } from '@/modules/contribute/components/centerSections/address';
import PhoneNumberSection from '@/modules/contribute/components/centerSections/phoneNumber';
import { CenterInfoData } from '@/modules/contribute/components/editCenterInfo';
import { useGetData } from '@/modules/contribute/hooks/useGetData';
import centerTypeOptions from '@/modules/contribute/schemas/centerTypeOptions';
import { Center, useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading } = useGetData();
  const profileData = useProfileDataStore(state => state.data);
  const userData = useUserInfoStore(state => state.info);
  const [selectedCenter, setSelectedCenter] = useState<Center>();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<CenterInfoData[]>([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [centerType, setCenterType] = useState('');
  const [centerName, setCenterName] = useState('');

  useEffect(() => {
    if (!isLoading && profileData && router.query?.center_id) {
      const center = profileData.centers?.find(center => center.id === router.query?.center_id);
      setSelectedCenter(center);
      setPhoneNumbers(center?.tell_array ?? []);
      setCenterName(center?.name ?? '');
      setCenterType(center?.center_type === 1 ? centerTypeOptions[0].label : centerTypeOptions[1].label);
      setAddresses([
        {
          address: center?.address,
          city: center?.city,
          province: center?.province,
          lat: center?.map?.lat,
          lng: center?.map?.lon,
        },
      ]);
    }
  }, [isLoading, profileData, router.query]);

  const onSubmit = () => {
    setIsButtonLoading(true);
    const dataEvent = {
      center_type: centerType,
      center_name: centerName,
      addresses,
      phone_numbers: phoneNumbers,
      center: {
        id: selectedCenter?.id,
        server_id: selectedCenter?.server_id,
      },
      user: {
        user_name: userData.username,
        terminal_id: getCookie('terminal_id'),
      },
    };
    splunkInstance().sendEvent({
      group: 'contribute crowdsourcing',
      type: 'contribute doctor profile request edit',
      event: { data: dataEvent },
    });
    router.replace({
      pathname: '/contribute/thank-you',
      query: { ...router.query },
    });
  };

  return (
    <div>
      <Head>
        <title>ویرایش اطلاعات مرکز درمانی {profileData.display_name}</title>
      </Head>

      <TopBar title={`ویرایش اطلاعات مرکز درمانی ${profileData.display_name}`} backButton titleLoading={isLoading} />
      <main className="md:max-w-md mx-auto flex flex-col p-5 pb-28 space-y-4">
        {selectedCenter?.center_type ? (
          <>
            <Autocomplete
              label="نوع مرکز درمانی"
              options={centerTypeOptions}
              size="small"
              defaultValue={centerType}
              onChange={value => setCenterType(value.label)}
              className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE]"
            />
            <TextField
              label="نام مرکز"
              size="small"
              defaultValue={selectedCenter?.name}
              onChange={e => setCenterName(e.target.value)}
              value={centerName}
              className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE]"
            />
            <hr className="border-slate-200" />
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
            <hr className="border-slate-200" />
            <PhoneNumberSection phoneNumbers={phoneNumbers} setPhoneNumbers={setPhoneNumbers} />
            <hr className="border-slate-200" />
          </>
        ) : (
          <FormLoading />
        )}

        <div className="bg-white md:bg-transparent fixed md:static bottom-0 right-0 w-full p-4 md:px-0 shadow-lg md:shadow-none">
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
      <hr className="border-slate-200" />
      <Skeleton w="6rem" h="1rem" rounded="full" />
      <div className="flex space-s-2">
        <Skeleton w="100%" h="3rem" rounded="lg" />
        <Skeleton w="3.5rem" h="3rem" rounded="lg" />
      </div>
      <Skeleton w="8rem" h="3rem" rounded="lg" />
      <hr className="border-slate-200" />
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

export default Home;
