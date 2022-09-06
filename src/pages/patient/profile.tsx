import Head from 'next/head';

import { useUpdateUser } from '@/common/apis/services/auth/user/updateUser';
import Avatar from '@/common/components/atom/avatar';
import Text from '@/common/components/atom/text';
import EditIcon from '@/common/components/icons/edit';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { PatinetProfileForm } from '@/modules/patientProfile/views/form';
import { ReactElement, useState } from 'react';
import { toast } from 'react-toastify';
import { NextPageWithLayout } from '../_app';

export const PatinetProfile: NextPageWithLayout = () => {
  const userInfo = useUserInfoStore(state => state.info);
  const userInfoPending = useUserInfoStore(state => state.pending);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const updateUser = useUpdateUser();
  const [avatarFile, setAvatarFile] = useState<FileList | null>();

  const handleUpdateUser = async (data: any) => {
    const res = await updateUser.mutateAsync({
      ...data,
      gender: data.gender.value,
      province: data.province.value,
      city: data.city.value,
    });
    if (res.data.status === 1) return setUserInfo({ ...res.data.result });
    toast.error(res.data.message);
  };

  const handleUploadUserAvatar = async (file: FileList | null) => {
    if (!file) return;
    const res = await updateUser.mutateAsync({
      image: file[0],
    });
    if (res.data.status === 1) return setUserInfo({ ...res.data.result });
    toast.error(res.data.message);
  };

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
        <label
          htmlFor="userAvatar"
          className="self-center cursor-pointer flex justify-center items-center text-white hover:text-transparent transition-all"
        >
          <Avatar
            className="brightness-50 hover:brightness-100 transition-all"
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
          className="hidden absolute"
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

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default PatinetProfile;
