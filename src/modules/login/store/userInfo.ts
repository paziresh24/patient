/* eslint-disable no-extra-boolean-cast */
import { clinicClient } from '@/common/apis/client';
import axios from 'axios';
import { getCookie, removeCookies } from 'cookies-next';
import { growthbook } from 'src/pages/_app';
import { create } from 'zustand';

interface UseUserInfoStore {
  isLogin: boolean;
  info: UserInfo;
  turnsCount: {
    presence: number;
  };
  pending: boolean;
  setUserInfo: (info: UserInfo) => void;
  removeInfo: () => void;
  setPending: (state: boolean) => void;
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
  };
};

export const useUserInfoStore = create<UseUserInfoStore>((set, get) => ({
  isLogin: typeof window != 'undefined' && !!localStorage?.getItem?.('user-store') ? true : false,
  info:
    typeof window != 'undefined' && !!localStorage?.getItem?.('user-store') ? JSON.parse(localStorage.getItem('user-store') ?? '{}') : {},
  pending: typeof window != 'undefined' && !!localStorage?.getItem?.('user-store') ? false : true,
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info => {
    set(() => {
      const infoCopy = {
        ...get().info,
        ...info,
        is_doctor: info.provider?.slug ? true : false,
        ...(info.provider?.slug && {
          provider: {
            job_title: info.provider?.slug ? 'doctor' : null,
            ...info?.provider,
          },
        }),
      };

      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_id: infoCopy.id,
        is_doctor: infoCopy.provider?.job_title === 'doctor',
      });
      window.user = infoCopy;

      localStorage.setItem(
        'user-store',
        JSON.stringify({
          ...infoCopy,
        }),
      );

      return {
        info: {
          ...infoCopy,
        },
        isLogin: true,
      };
    });
  },
  removeInfo: () => {
    localStorage.removeItem('user-store');
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
  setTurnsCount: turnsCount => {
    set(state => ({
      ...state,
      turnsCount,
    }));
  },
  logout: () => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      user_id: undefined,
      is_doctor: false,
    });
    set(() => ({
      info: {},
      isLogin: false,
    }));
    try {
      axios
        .get('https://users.paziresh24.com/webhook/logout', {
          withCredentials: !getCookie('token'),
          ...(getCookie('token') && {
            headers: {
              Authorization: 'Bearer ' + getCookie('token'),
            },
          }),
        })
        .then(() => {
          clinicClient.get('/logout');
        });
    } catch (error) {
      console.error(error);
    }
    removeCookies('certificate');
    removeCookies('token');
    localStorage.removeItem('user-store');
  },
}));
