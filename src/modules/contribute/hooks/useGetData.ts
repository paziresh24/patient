import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useProfileDataStore } from '../store/profileData';

export const useGetData = () => {
  const router = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pendingLogin = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();

  const getProfileData = useGetProfileData(
    {
      slug: router.query?.slug?.toString() ?? '/',
    },
    {
      enabled: !!router.query?.slug,
    },
  );
  const setProfileData = useProfileDataStore(state => state.setData);

  useEffect(() => {
    if (!pendingLogin && !isLogin) {
      handleOpenLoginModal({
        state: true,
      });
    }
  }, [isLogin, pendingLogin]);

  useEffect(() => {
    if (getProfileData.isSuccess) {
      setProfileData(getProfileData.data?.data?.data);
    }
  }, [getProfileData.status]);

  return { isLoading: !getProfileData.isSuccess || pendingLogin || !isLogin };
};
