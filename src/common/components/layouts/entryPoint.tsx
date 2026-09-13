import { useGetMe } from '@/common/apis/services/auth/me';
import { getCentersByUserId } from '@/common/apis/services/doctor/centersByUserId';
import { getDoctorProfile } from '@/common/apis/services/doctor/profile';
import { useDoctorHomeRedirect, isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { clearDoctorDeviceCache, isDoctorDeviceCached, setDoctorDeviceCache } from '@/common/utils/doctorDeviceCache';
import { clearDoctorHomeViewSelection } from '@/modules/doctorHome/store/clearDoctorHomeViewSelection';
import { useSelectedCenterStore } from '@/modules/doctorHome/store/selectedCenter';
import {
  clearDoctorHomeShell,
  readDoctorHomeShell,
  shellToUserInfoPatch,
  writeDoctorHomeShell,
} from '@/modules/doctorHome/utils/doctorHomeShell';
import { clearPersistedLauncherFlag } from '@/modules/doctorHome/utils/doctorHomeLauncherFlag';
import { clearDoctorHomePersistedCache } from '@/modules/doctorHome/utils/doctorHomeQueryPersist';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { growthbook } from '@/common/growthbook/client';
import { picUserImageUrl } from '@/common/utils/picUserImageUrl';
import { ReactElement, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

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
  const hasHydratedShell = useRef(false);
  const syncedDoctorCentersUserId = useRef<string | null>(null);
  const syncedDoctorSlugUserId = useRef<string | null>(null);

  getMeRef.current = getMe;

  useDoctorHomeRedirect();

  // Hydrate doctor shell before paint so `/_/` can show new home (centers/job_title) on first frame.
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || hasHydratedShell.current) return;
    hasHydratedShell.current = true;
    if (!isDoctorDeviceCached()) return;
    const shell = readDoctorHomeShell();
    if (shell) {
      setUserInfo(shellToUserInfoPatch(shell));
    }
  }, [setUserInfo]);

  const syncDoctorCenters = useCallback(
    async (userId: string) => {
      if (syncedDoctorCentersUserId.current === userId) return;

      syncedDoctorCentersUserId.current = userId;
      setDoctorProfilePending(true);

      const existingSlug = useUserInfoStore.getState().info.provider?.slug;
      const needsSlug = !existingSlug;
      if (needsSlug) {
        syncedDoctorSlugUserId.current = userId;
        setDoctorSlugPending(true);
      }

      try {
        // Always fetch doctor profile so slug (needed for rate/pageView) is available.
        const [centersData, doctorProfileData] = await Promise.all([
          getCentersByUserId(userId),
          getDoctorProfile().catch(error => {
            console.error('Error fetching doctor profile slug:', error);
            if (needsSlug) syncedDoctorSlugUserId.current = null;
            return null;
          }),
        ]);

        const latestInfo = useUserInfoStore.getState().info;
        const slug = doctorProfileData?.slug || existingSlug;
        const centersList = Array.isArray(centersData) ? centersData : undefined;

        setUserInfo({
          ...latestInfo,
          provider: {
            ...latestInfo?.provider,
            ...(Array.isArray(centersList) ? { centers: centersList } : {}),
            ...(slug ? { slug } : {}),
          },
        });

        const updatedInfo = useUserInfoStore.getState().info;
        if (isDoctorUser(updatedInfo)) {
          setDoctorDeviceCache();
          writeDoctorHomeShell({
            userId: String(updatedInfo.id),
            provider: {
              job_title: 'doctor',
              slug: updatedInfo.provider?.slug,
              centers: updatedInfo.provider?.centers ?? [],
            },
          });

          const selectedCenterId = useSelectedCenterStore.getState().selectedCenterId;
          if (selectedCenterId) {
            const centers = updatedInfo.provider?.centers ?? [];
            const found = centers.some((center: { id?: string | number }) => String(center?.id) === selectedCenterId);
            if (!found) {
              useSelectedCenterStore.getState().setSelectedCenterId(null);
            }
          }

          // Slug still missing after profile fetch — allow a later retry.
          if (!updatedInfo.provider?.slug) {
            syncedDoctorCentersUserId.current = null;
            syncedDoctorSlugUserId.current = null;
          }
        } else if (Array.isArray(centersData)) {
          clearDoctorDeviceCache();
          syncedDoctorSlugUserId.current = null;
        } else {
          syncedDoctorCentersUserId.current = null;
          syncedDoctorSlugUserId.current = null;
        }
      } catch (error) {
        console.error('Error fetching doctor centers:', error);
        syncedDoctorCentersUserId.current = null;
        syncedDoctorSlugUserId.current = null;
      } finally {
        setDoctorProfilePending(false);
        if (needsSlug) {
          setDoctorSlugPending(false);
        }
      }
    },
    [setDoctorProfilePending, setDoctorSlugPending, setUserInfo],
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

        const shell = readDoctorHomeShell();
        const userMismatch = Boolean(shell && shell.userId !== String(userData.id));
        if (userMismatch) {
          clearDoctorHomeShell();
          clearDoctorHomeViewSelection();
          clearDoctorHomePersistedCache();
          clearPersistedLauncherFlag();
          // Drop shell-hydrated provider before applying the real user.
          useUserInfoStore.setState({ info: {}, isLogin: false });
        }

        const currentInfo = useUserInfoStore.getState().info;
        setUserInfo({
          ...currentInfo,
          ...userData,
        });

        // Unblock UI immediately after auth — centers/slug sync in background.
        setPending(false);

        const updatedInfo = useUserInfoStore.getState().info;
        if (isDoctorUser(updatedInfo)) {
          setDoctorDeviceCache();
        }

        void syncDoctorCentersRef.current(userData.id.toString());
      } catch (error) {
        if (typeof window !== 'undefined' && window.user) {
          window.user = {};
        }

        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          user_id: undefined,
          is_doctor: false,
        });

        clearDoctorHomeShell();
        clearDoctorHomeViewSelection();
        clearPersistedLauncherFlag();

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
  }, [setPending, setUserInfo]);

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
