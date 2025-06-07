import { apiGatewayClient } from '@/common/apis/client';
import { useGetMe } from '@/common/apis/services/auth/me';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ReactElement, useEffect } from 'react';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const info = useUserInfoStore(state => state.info);
  const autoLoginToGozargah = useFeatureIsOn('auto-login-to-gozargah');

  const getMe = useGetMe();
  const getDoctorProfile = useGetDoctorProfile();

  useEffect(() => {
    handleUserLogin();
  }, []);

  const handleUserLogin = async () => {
    try {
      if (typeof window != 'undefined' && !!localStorage?.getItem?.('user-store') ? false : true) {
        setPending(true);
      }
      const userData = await getMe.mutateAsync();
      const doctorProfileData = await getDoctorProfile.mutateAsync();

      setUserInfo({
        provider: doctorProfileData,
        ...userData,
      });

      setPending(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          setPending(false);
          removeInfo();
        }
      }
    }
  };

  useEffect(() => {
    if (isLogin && info?.id) {
      try {
        apiGatewayClient.get('https://apigw.paziresh24.com/v1/users/image', { params: { user_id: info?.id } })?.then(image => {
          setUserInfo({
            ...info,
            image: image?.data?.data?.image_url,
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [isLogin, info?.id]);

  return (
    <>
      {children}
      {isLogin &&
        info?.id &&
        autoLoginToGozargah &&
        window.location.pathname != '/login/oauthEmbed/' &&
        info?.id != getCookie('gozargah_logged_in_user_id') && (
          <iframe
            src={`https://user.paziresh24.com/realms/paziresh24/protocol/openid-connect/auth?client_id=p24&redirect_uri=https://www.paziresh24.com/login/oauthEmbed/&response_type=code&scope=openid&kc_idp_hint=gozar&skip_prompt=true`}
            hidden
            className="absolute top-0 w-0 h-0 hidden"
          ></iframe>
        )}
    </>
  );
};
