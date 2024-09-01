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
    job_title?: 'doctor';
    slug?: string;
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
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_id: info.id,
        is_doctor: info.provider?.job_title === 'doctor',
      });
      window.user = info;
      return {
        info: {
          ...info,
          cell: info.cell,
          is_foreigner: info.is_foreigner == '1',
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
  setTurnsCount: turnsCount => {
    set(state => ({
      ...state,
      turnsCount,
    }));
  },
  logout: () => {
    removeCookies('certificate');
    removeCookies('token');
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
          withCredentials: true,
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
  },
}));
