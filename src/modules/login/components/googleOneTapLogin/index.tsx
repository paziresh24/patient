import { apiGatewayClient } from '@/common/apis/client';
import { useEffect, useRef } from 'react';
import { useUserInfoStore } from '../../store/userInfo';
import { useGetMe } from '@/common/apis/services/auth/me';
import { getCentersByUserId } from '@/common/apis/services/doctor/centersByUserId';
import useCustomize from '@/common/hooks/useCustomize';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

declare global {
  interface Window {
    google?: any;
  }
}

const GoogleOneTap = () => {
  const pending = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const getMe = useGetMe();
  const university = useCustomize(state => state.customize?.partnerKey);
  const setPending = useUserInfoStore(state => state.setPending);
  const isEnable = useFeatureIsOn('google-one-tap-login');

  const interval = useRef<any>(null);

  useEffect(() => {
    if (!pending && !isLogin && !university && isEnable) {
      interval.current = setInterval(() => {
        if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.id) {
          clearInterval(interval.current);

          window.google.accounts.id.initialize({
            client_id: '800247396141-7ldqmp1so1opdu47sgups4tpl6b8q8hr.apps.googleusercontent.com',
            callback: handleCredentialResponse,
          });

          window.google.accounts.id.prompt();
        }
      }, 100);
    }
    return () => clearInterval(interval.current);
  }, [pending, isLogin, university, isEnable]);

  const handleCredentialResponse = async (response: { credential: string }) => {
    const idToken = response.credential;
    try {
      setPending(true);
      await apiGatewayClient.get('https://apigw.paziresh24.com/v1/gozargah/got-login', {
        params: {
          token: idToken,
        },
      });

      const userData = await getMe.mutateAsync();
      const centersData = userData?.id ? await getCentersByUserId(userData.id.toString()) : [];

      setUserInfo({
        ...userData,
        provider: {
          ...(Array.isArray(centersData) ? { centers: centersData } : { centers: [] }),
        },
      });
      setPending(false);
    } catch (error) {
      console.error(error);
    }
  };

  return null;
};

export default GoogleOneTap;
