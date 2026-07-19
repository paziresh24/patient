/* eslint-disable no-extra-boolean-cast */
import { clinicClient } from '@/common/apis/client';
import { removeCookies } from 'cookies-next';
import isEmpty from 'lodash/isEmpty';
import { growthbook } from 'src/pages/_app';
import { create } from 'zustand';
import { clearDoctorDeviceCache, setDoctorDeviceCache } from '@/common/utils/doctorDeviceCache';

interface UseUserInfoStore {
  isLogin: boolean;
  info: UserInfo;
  turnsCount: {
    presence: number;
  };
  pending: boolean;
  doctorProfilePending: boolean;
  setUserInfo: (info: UserInfo) => void;
  removeInfo: () => void;
  setPending: (state: boolean) => void;
  setDoctorProfilePending: (state: boolean) => void;
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
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info => {
    set(() => {
      const mergedProvider = {
        ...get().info?.provider,
        ...info?.provider,
      };
      const isDoctor = !!(
        mergedProvider.slug ||
        !isEmpty(mergedProvider.centers) ||
        mergedProvider.job_title === 'doctor' ||
        info.is_doctor === true ||
        get().info?.is_doctor === true
      );

      const infoCopy = {
        ...get().info,
        ...info,
        is_doctor: isDoctor,
        provider: {
          ...mergedProvider,
          job_title: isDoctor ? 'doctor' : null,
        },
      };

      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_id: infoCopy.id != null && infoCopy.id !== '' ? String(infoCopy.id) : undefined,
        loggedIn: true,
        is_doctor: infoCopy.provider?.job_title === 'doctor',
      });
      void growthbook.refreshFeatures({ skipCache: true });
      window.user = infoCopy;

      if (infoCopy.provider?.job_title === 'doctor') {
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
  setTurnsCount: turnsCount => {
    set(state => ({
      ...state,
      turnsCount,
    }));
  },
  logout: () => {
    clearDoctorDeviceCache();
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
    }));
    clinicClient.get('/logout').catch(console.error);
    removeCookies('certificate');
    removeCookies('token');
  },
}));
