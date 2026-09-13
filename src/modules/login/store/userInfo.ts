/* eslint-disable no-extra-boolean-cast */
import { clinicClient } from '@/common/apis/client';
import { removeCookies } from 'cookies-next';
import { growthbook } from '@/common/growthbook/client';
import { create } from 'zustand';
import { clearDoctorDeviceCache, setDoctorDeviceCache } from '@/common/utils/doctorDeviceCache';
import { clearDoctorHomeViewSelection } from '@/modules/doctorHome/store/clearDoctorHomeViewSelection';
import { clearDoctorHomePersistedCache } from '@/modules/doctorHome/utils/doctorHomeQueryPersist';
import { clearPersistedLauncherFlag } from '@/modules/doctorHome/utils/doctorHomeLauncherFlag';
import { clearDoctorHomeShell } from '@/modules/doctorHome/utils/doctorHomeShell';

interface UseUserInfoStore {
  isLogin: boolean;
  info: UserInfo;
  turnsCount: {
    presence: number;
  };
  pending: boolean;
  doctorProfilePending: boolean;
  doctorSlugPending: boolean;
  setUserInfo: (info: UserInfo) => void;
  removeInfo: () => void;
  setPending: (state: boolean) => void;
  setDoctorProfilePending: (state: boolean) => void;
  setDoctorSlugPending: (state: boolean) => void;
  setTurnsCount: (turnsCount: { presence: number }) => void;
  logout: () => void;
}

export type UserInfo = {
  name?: string;
  family?: string;
  id?: string;
  username?: string;
  national_code?: string;
  is_foreigner?: any;
  gender?: 'male' | 'female';
  city_id?: string;
  province_id?: string;
  country_code_id?: string;
  image?: string;
  cell?: string;
  is_doctor?: boolean;
  profile?: any;
  vip?: string;
  insurance_id?: string;
  father_name?: string;
  birth_date?: string;
  email?: string;
  provider?: {
    job_title?: 'doctor' | string | null;
    slug?: string;
    centers?: any[];
  };
};

export const useUserInfoStore = create<UseUserInfoStore>((set, get) => ({
  isLogin: false,
  info: {},
  pending: true,
  doctorProfilePending: false,
  doctorSlugPending: false,
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info => {
    set(() => {
      const prevProvider = get().info?.provider;
      const incomingProvider = info?.provider;
      const centers = Array.isArray(incomingProvider?.centers) ? incomingProvider.centers : prevProvider?.centers;
      const mergedProvider = {
        ...prevProvider,
        ...incomingProvider,
        ...(Array.isArray(centers) ? { centers } : {}),
      };
      // Doctor identity: non-empty centers. Missing/null centers must not wipe a prior list.
      const isDoctor = Array.isArray(centers) && centers.length > 0;

      const infoCopy = {
        ...get().info,
        ...info,
        is_doctor: isDoctor,
        provider: {
          ...mergedProvider,
          // Preserve slug from prior profile fetch when callers omit it.
          slug: info?.provider?.slug ?? mergedProvider.slug,
          job_title: isDoctor ? 'doctor' : null,
        },
      };

      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_id: infoCopy.id != null && infoCopy.id !== '' ? String(infoCopy.id) : undefined,
        loggedIn: true,
        is_doctor: isDoctor,
      });
      void growthbook.refreshFeatures({ skipCache: true });
      window.user = infoCopy;

      if (isDoctor) {
        setDoctorDeviceCache();
      }

      return {
        info: {
          ...infoCopy,
        },
        isLogin: true,
      };
    });
  },
  removeInfo: () => {
    set(() => ({
      info: {},
      isLogin: false,
    }));
  },
  setPending: pending => {
    set(state => ({
      ...state,
      pending,
    }));
  },
  setDoctorProfilePending: doctorProfilePending => {
    set(state => ({
      ...state,
      doctorProfilePending,
    }));
  },
  setDoctorSlugPending: doctorSlugPending => {
    set(state => ({
      ...state,
      doctorSlugPending,
    }));
  },
  setTurnsCount: turnsCount => {
    set(state => ({
      ...state,
      turnsCount,
    }));
  },
  logout: () => {
    clearDoctorDeviceCache();
    clearDoctorHomePersistedCache();
    clearDoctorHomeShell();
    clearDoctorHomeViewSelection();
    clearPersistedLauncherFlag();
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      user_id: undefined,
      loggedIn: false,
      is_doctor: false,
    });
    set(() => ({
      info: {},
      isLogin: false,
      doctorProfilePending: false,
      doctorSlugPending: false,
    }));
    clinicClient.get('/logout').catch(console.error);
    removeCookies('certificate');
    removeCookies('token');
  },
}));
