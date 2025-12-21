import { apiGatewayClient } from '@/common/apis/client';
import { useGetMe } from '@/common/apis/services/auth/me';
import { useGetCentersByUserId } from '@/common/apis/services/doctor/centersByUserId';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { growthbook } from 'src/pages/_app';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ReactElement, useEffect, useMemo, useRef } from 'react';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const info = useUserInfoStore(state => state.info);
  const autoLoginToGozargah = useFeatureIsOn('auto-login-to-gozargah');

  const getMe = useGetMe();
  const getDoctorProfile = useGetDoctorProfile();
  const getCentersByUserId = useGetCentersByUserId(info?.id?.toString() || '', { enabled: !!info?.id });
  const hasCalledLogin = useRef(false);
  const lastUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined' || hasCalledLogin.current) return;

    hasCalledLogin.current = true;

    const fetchUserData = async () => {
      setPending(true);

      try {
        const userData = await getMe.mutateAsync();

        const currentInfo = useUserInfoStore.getState().info;
        setUserInfo({
          ...currentInfo,
          ...userData,
        });

        setPending(false);
      } catch (error) {
        if (typeof window !== 'undefined' && window.user) {
          window.user = {};
        }

        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          user_id: undefined,
          is_doctor: false,
        });

        lastUserId.current = undefined;
        hasCalledLogin.current = false;

        useUserInfoStore.setState({
          info: {},
          isLogin: false,
          pending: false,
          turnsCount: {
            presence: 0,
          },
        });
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!info?.id || info.id === lastUserId.current) return;

    lastUserId.current = info.id;

    const fetchProfileAndCenters = async () => {
      try {
        const doctorProfileData = await getDoctorProfile.mutateAsync();
        const currentInfo = useUserInfoStore.getState().info;

        setUserInfo({
          ...currentInfo,
          provider: {
            ...currentInfo?.provider,
            ...doctorProfileData,
          },
        });
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    };

    fetchProfileAndCenters();
  }, [info?.id, getDoctorProfile, setUserInfo]);

  useEffect(() => {
    if (!isLogin || !info?.id) return;

    apiGatewayClient
      .get('https://apigw.paziresh24.com/v1/users/image', { params: { user_id: info.id } })
      .then(response => {
        const imageUrl = response?.data?.data?.image_url;
        if (imageUrl) {
          const currentInfo = useUserInfoStore.getState().info;
          setUserInfo({
            ...currentInfo,
            image: imageUrl,
          });
        }
      })
      .catch(error => {
        console.error('Error fetching user image:', error);
      });
  }, [isLogin, info?.id, setUserInfo]);

  useEffect(() => {
    const centersData = getCentersByUserId?.data;
    if (!centersData || !info?.id) return;

    const isDoctor = Array.isArray(centersData) && centersData.length > 0;
    const currentInfo = useUserInfoStore.getState().info;

    setUserInfo({
      ...currentInfo,
      is_doctor: isDoctor,
      provider: {
        ...currentInfo?.provider,
        job_title: isDoctor ? 'doctor' : null,
        centers: centersData,
      },
    });
  }, [getCentersByUserId?.data, info?.id, setUserInfo]);

  return <>{children}</>;
};
