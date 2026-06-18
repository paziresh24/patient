import { useGetMe } from '@/common/apis/services/auth/me';
import { getCentersByUserId } from '@/common/apis/services/doctor/centersByUserId';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import { useDoctorHomeRedirect, isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { clearDoctorDeviceCache, setDoctorDeviceCache } from '@/common/utils/doctorDeviceCache';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { growthbook } from 'src/pages/_app';
import { picUserImageUrl } from '@/common/utils/picUserImageUrl';
import { ReactElement, useCallback, useEffect, useRef } from 'react';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const setDoctorProfilePending = useUserInfoStore(state => state.setDoctorProfilePending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const info = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const getMe = useGetMe();
  const getDoctorProfile = useGetDoctorProfile();
  const getMeRef = useRef(getMe);
  const syncDoctorProfileRef = useRef<(userId: string) => Promise<void>>(async () => {});
  const hasCalledLogin = useRef(false);
  const syncedDoctorProfileUserId = useRef<string | null>(null);

  getMeRef.current = getMe;

  useDoctorHomeRedirect();

  const syncDoctorProfile = useCallback(
    async (userId: string) => {
      if (syncedDoctorProfileUserId.current === userId) return;

      syncedDoctorProfileUserId.current = userId;
      setDoctorProfilePending(true);

      try {
        const [doctorProfileData, centersData] = await Promise.all([
          getDoctorProfile.mutateAsync(),
          getCentersByUserId(userId),
        ]);

        const latestInfo = useUserInfoStore.getState().info;

        setUserInfo({
          ...latestInfo,
          provider: {
            ...latestInfo?.provider,
            ...doctorProfileData,
            ...(Array.isArray(centersData) ? { centers: centersData } : {}),
          },
        });

        const updatedInfo = useUserInfoStore.getState().info;
        if (isDoctorUser(updatedInfo)) {
          setDoctorDeviceCache();
        } else {
          clearDoctorDeviceCache();
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        syncedDoctorProfileUserId.current = null;
      } finally {
        setDoctorProfilePending(false);
      }
    },
    [getDoctorProfile, setDoctorProfilePending, setUserInfo],
  );

  syncDoctorProfileRef.current = syncDoctorProfile;

  useEffect(() => {
    if (typeof window === 'undefined' || hasCalledLogin.current) return;

    hasCalledLogin.current = true;

    const fetchUserData = async () => {
      setPending(true);

      try {
        const userData = await getMeRef.current.mutateAsync();

        if (!userData?.id) {
          throw new Error('User is not authenticated');
        }

        const currentInfo = useUserInfoStore.getState().info;
        setUserInfo({
          ...currentInfo,
          ...userData,
        });

        setPending(false);

        const updatedInfo = useUserInfoStore.getState().info;
        if (isDoctorUser(updatedInfo)) {
          setDoctorDeviceCache();
        } else {
          clearDoctorDeviceCache();
        }

        await syncDoctorProfileRef.current(userData.id.toString());
      } catch (error) {
        if (typeof window !== 'undefined' && window.user) {
          window.user = {};
        }

        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          user_id: undefined,
          is_doctor: false,
        });

        syncedDoctorProfileUserId.current = null;

        useUserInfoStore.setState({
          info: {},
          isLogin: false,
          pending: false,
          doctorProfilePending: false,
          turnsCount: {
            presence: 0,
          },
        });
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isLogin) {
      syncedDoctorProfileUserId.current = null;
      return;
    }
    if (!info?.id || pending) return;

    void syncDoctorProfile(info.id.toString());
  }, [isLogin, info?.id, pending, syncDoctorProfile]);

  useEffect(() => {
    if (!isLogin || !info?.id) return;

    const imageUrl = picUserImageUrl(info.id);
    const currentInfo = useUserInfoStore.getState().info;
    setUserInfo({
      ...currentInfo,
      image: imageUrl,
    });
  }, [isLogin, info?.id, setUserInfo]);

  return <>{children}</>;
};
