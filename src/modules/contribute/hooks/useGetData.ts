import { useGetUser } from '@/common/apis/services/auth/me';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useProfileDataStore } from '../store/profileData';
import { useUserDataStore } from '../store/userData';

export const useGetData = () => {
  const router = useRouter();
  const getProfileData = useGetProfileData(
    {
      slug: router.query?.slug?.toString() ?? '/',
    },
    {
      enabled: !!router.query?.slug,
    },
  );
  const getUserData = useGetUser();
  const setProfileData = useProfileDataStore(state => state.setData);
  const setUserData = useUserDataStore(state => state.setUser);

  useEffect(() => {
    if (getProfileData.isSuccess) {
      setProfileData(getProfileData.data?.data?.data);
    }
    if (getUserData.isSuccess) {
      setUserData(getUserData.data.data.data);
    }
    if (getUserData.isError) {
      toast.dark('خطا در احراز هویت، لطفا وارد شوید.');
    }
  }, [getProfileData.status, getUserData.status]);

  return { isLoading: !getProfileData.isSuccess || !getUserData.isSuccess };
};
