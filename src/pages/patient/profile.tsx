import { usePatchUser } from '@/common/apis/services/auth/user/patchUser';
import { useUpdateUser } from '@/common/apis/services/auth/user/updateUser';
import Avatar from '@/common/components/atom/avatar';
import Text from '@/common/components/atom/text';
import EditIcon from '@/common/components/icons/edit';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { PatinetProfileForm } from '@/modules/patient/views/form';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';
import { toast } from 'react-hot-toast';

export const PatinetProfile = () => {
  const { query } = useRouter();
  const { t } = useTranslation('patient/profile');
  const userInfo = useUserInfoStore(state => state.info);
  const userInfoPending = useUserInfoStore(state => state.pending);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const updateUser = useUpdateUser();
  const patchUser = usePatchUser();

  const handleUpdateUser = async ({ is_foreigner, ...data }: any) => {
    try {
      await patchUser.mutateAsync({
        ...data,
        gender: data.gender.value,
        user_id: userInfo.id,
      });
      toast.success('اطلاعات شما با موفقیت ویرایش شد.');
      return setUserInfo({
        ...userInfo,
        ...data,
        gender: data.gender.value,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
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
      <Seo title={t('title')} noIndex />

      <AppBar title={t('title')} className="hidden pwa:!flex" backButton={query.referrer === 'profile'} />

      <div className="flex flex-col p-5 bg-white">
        <Text fontWeight="black" fontSize="xl" className="mb-5 pwa:hidden">
          {t('title')}
        </Text>
        <label
          htmlFor="userAvatar"
          className="flex items-center self-center justify-center mb-5 text-white transition-all cursor-pointer hover:text-transparent"
        >
          <Avatar
            className="transition-all brightness-50 hover:brightness-100"
            name={(() => {
              const name = userInfo.name?.trim() || '';
              const family = userInfo.family?.trim() || '';
              if (!name && !family) return '';
              if (!name) return family;
              if (!family) return name;
              return `${name} ${family}`;
            })()}
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
            fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE']}
            defaultValues={{
              NAME: userInfo.name,
              FAMILY: userInfo.family,
              GENDER: userInfo.gender,
              NATIONAL_CODE: userInfo.national_code,
            }}
            onSubmit={handleUpdateUser}
            loading={patchUser.isLoading}
            errorsField={{ ...patchUser.data?.data?.details }}
          />
        )}
      </div>
    </>
  );
};

PatinetProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config}>
      <PatientProfileLayout>{page}</PatientProfileLayout>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default PatinetProfile;
