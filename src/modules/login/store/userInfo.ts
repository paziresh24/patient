/* eslint-disable no-extra-boolean-cast */
import { clinicClient } from '@/common/apis/client';
import axios from 'axios';
import { getCookie, removeCookies } from 'cookies-next';
import isEmpty from 'lodash/isEmpty';
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
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info => {
    set(() => {
      const infoCopy = {
        is_doctor: info.provider?.slug || !isEmpty(info.provider?.centers) ? true : false,
        ...get().info,
        ...info,
        provider: {
          job_title: info.provider?.slug || !isEmpty(info.provider?.centers) ? 'doctor' : null,
          ...get().info?.provider,
          ...info?.provider,
        },
      };

      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_id: infoCopy.id,
        is_doctor: infoCopy.provider?.job_title === 'doctor',
      });
      window.user = infoCopy;
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'user_ready',
        user_id: infoCopy.id,
        is_doctor: infoCopy.provider?.job_title === 'doctor',
      });

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
    window.user = {};
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: 'user_cleared' });
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
    window.user = {};
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: 'user_logout' });
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
  },
}));
