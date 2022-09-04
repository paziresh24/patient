import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { PatinetProfileForm } from '@/modules/patientProfile/views/form';
import { NextPageWithLayout } from '../_app';

export const PatinetProfile: NextPageWithLayout = () => {
  const userInfo = useUserInfoStore(state => state.info);

  return (
    <>
      <Head>
        <title>پروفایل</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex space-y-5 flex-col p-5 bg-white">
        <Text fontWeight="black" fontSize="xl">
          ویرایش اطلاعات من
        </Text>
        <PatinetProfileForm
          fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CITIES', 'PROVINCES']}
          defaultValues={{
            NAME: userInfo.name,
            FAMILY: userInfo.family,
            GENDER: userInfo.gender,
            NATIONAL_CODE: userInfo.national_code,
            CITIES: userInfo.city_id,
            PROVINCES: userInfo.province_id,
          }}
        />
      </div>
    </>
  );
};

PatinetProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter>
      <PatientProfileLayout>{page}</PatientProfileLayout>
    </LayoutWithHeaderAndFooter>
  );
};

export default PatinetProfile;
