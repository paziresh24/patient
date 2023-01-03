import Head from 'next/head';

import { useUpdateUser } from '@/common/apis/services/auth/user/updateUser';
import Avatar from '@/common/components/atom/avatar';
import Text from '@/common/components/atom/text';
import EditIcon from '@/common/components/icons/edit';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { withCSR } from '@/common/hoc/withCsr';
import useWebView from '@/common/hooks/useWebView';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { PatinetProfileForm } from '@/modules/patient/views/form';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { toast } from 'react-hot-toast';
import { NextPageWithLayout } from '../_app';

export const PatinetProfile: NextPageWithLayout = () => {
  const { query } = useRouter();
  const isWebView = useWebView();
  const { t } = useTranslation('patient/profile');
  const userInfo = useUserInfoStore(state => state.info);
  const userInfoPending = useUserInfoStore(state => state.pending);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const updateUser = useUpdateUser();

  const handleUpdateUser = async (data: any) => {
    const res = await updateUser.mutateAsync({
      ...data,
      gender: data.gender.value,
      province: data.province.value,
      city: data.city.value,
    });
    if (res.data.status === ClinicStatus.SUCCESS) {
      toast.success('اطلاعات شما با موفقیت ویرایش شد.');
      return setUserInfo({ ...res.data.result });
    }
    toast.error(res.data.message);
  };

  const handleUploadUserAvatar = async (file: FileList | null) => {
    if (!file) return;
    const res = await updateUser.mutateAsync({
      image: file[0],
    });
    if (res.data.status === ClinicStatus.SUCCESS) return setUserInfo({ ...res.data.result });
    toast.error(res.data.message);
  };

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {isWebView && <AppBar title={t('title')} className="border-b border-slate-200" backButton={query.referrer === 'profile'} />}

      <div className="flex flex-col p-5 space-y-5 bg-white">
        {!isWebView && (
          <Text fontWeight="black" fontSize="xl">
            {t('title')}
          </Text>
        )}
        <label
          htmlFor="userAvatar"
          className="flex items-center self-center justify-center text-white transition-all cursor-pointer hover:text-transparent"
        >
          <Avatar
            className="transition-all brightness-50 hover:brightness-100"
            name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`}
            src={userInfo.image ?? ''}
            width={120}
            height={120}
          />
          <EditIcon className="absolute w-10 h-10" />
        </label>
        <input
          id="userAvatar"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/bmp"
          onChange={e => handleUploadUserAvatar(e.target.files)}
          className="absolute hidden"
        />
        {!userInfoPending && (
          <PatinetProfileForm
            fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CITIES', 'PROVINCES']}
            defaultValues={{
              NAME: userInfo.name,
              FAMILY: userInfo.family,
              GENDER: userInfo.gender,
              NATIONAL_CODE: userInfo.national_code,
              CITY: userInfo.city_id,
              PROVINCE: userInfo.province_id,
            }}
            onSubmit={handleUpdateUser}
            loading={updateUser.isLoading}
            errorsField={{ ...updateUser.data?.data?.details }}
          />
        )}
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

export const getServerSideProps = withCSR(async () => {
  return {
    props: {},
  };
});

export default PatinetProfile;
