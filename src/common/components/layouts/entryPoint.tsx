import { useGetMe } from '@/common/apis/services/auth/me';
import { getCentersByUserId } from '@/common/apis/services/doctor/centersByUserId';
import { getDoctorProfile } from '@/common/apis/services/doctor/profile';
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
  const setDoctorSlugPending = useUserInfoStore(state => state.setDoctorSlugPending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const info = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const getMe = useGetMe();
  const getMeRef = useRef(getMe);
  const syncDoctorCentersRef = useRef<(userId: string) => Promise<void>>(async () => {});
  const hasCalledLogin = useRef(false);
  const syncedDoctorCentersUserId = useRef<string | null>(null);
  const syncedDoctorSlugUserId = useRef<string | null>(null);

  getMeRef.current = getMe;

  useDoctorHomeRedirect();

  const syncDoctorSlug = useCallback(
    async (userId: string) => {
      if (syncedDoctorSlugUserId.current === userId) return;
      if (useUserInfoStore.getState().info.provider?.slug) {
        syncedDoctorSlugUserId.current = userId;
        return;
      }

      syncedDoctorSlugUserId.current = userId;
      setDoctorSlugPending(true);

      try {
        const doctorProfileData = await getDoctorProfile();
        const slug = doctorProfileData?.slug;
        if (!slug) return;

        const latestInfo = useUserInfoStore.getState().info;
        setUserInfo({
          ...latestInfo,
          provider: {
            ...latestInfo?.provider,
            slug,
          },
        });
      } catch (error) {
        console.error('Error fetching doctor profile slug:', error);
        syncedDoctorSlugUserId.current = null;
      } finally {
        setDoctorSlugPending(false);
      }
    },
    [setDoctorSlugPending, setUserInfo],
  );

  const syncDoctorCenters = useCallback(
    async (userId: string) => {
      if (syncedDoctorCentersUserId.current === userId) return;

      syncedDoctorCentersUserId.current = userId;
      setDoctorProfilePending(true);

      try {
        const centersData = await getCentersByUserId(userId);
        const latestInfo = useUserInfoStore.getState().info;

        setUserInfo({
          ...latestInfo,
          provider: {
            ...latestInfo?.provider,
            ...(Array.isArray(centersData) ? { centers: centersData } : { centers: [] }),
          },
        });

        const updatedInfo = useUserInfoStore.getState().info;
        if (isDoctorUser(updatedInfo)) {
          setDoctorDeviceCache();
          // Slug only — does not gate doctor identity / home redirect.
          void syncDoctorSlug(userId);
        } else {
          clearDoctorDeviceCache();
          setDoctorSlugPending(false);
          syncedDoctorSlugUserId.current = null;
        }
      } catch (error) {
        console.error('Error fetching doctor centers:', error);
        syncedDoctorCentersUserId.current = null;
      } finally {
        setDoctorProfilePending(false);
      }
    },
    [setDoctorProfilePending, setDoctorSlugPending, setUserInfo, syncDoctorSlug],
  );

  syncDoctorCentersRef.current = syncDoctorCenters;

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

        await syncDoctorCentersRef.current(userData.id.toString());
      } catch (error) {
        if (typeof window !== 'undefined' && window.user) {
          window.user = {};
        }

        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          user_id: undefined,
          is_doctor: false,
        });

        syncedDoctorCentersUserId.current = null;
        syncedDoctorSlugUserId.current = null;

        useUserInfoStore.setState({
          info: {},
          isLogin: false,
          pending: false,
          doctorProfilePending: false,
          doctorSlugPending: false,
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
      syncedDoctorCentersUserId.current = null;
      syncedDoctorSlugUserId.current = null;
      return;
    }
    if (!info?.id || pending) return;

    void syncDoctorCenters(info.id.toString());
  }, [isLogin, info?.id, pending, syncDoctorCenters]);

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
