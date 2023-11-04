import { clinicClient } from '@/common/apis/client';
import { isPWA } from '@/common/utils/isPwa';
import { firebaseCloudMessaging } from '@/firebase/fcm';
import { getCookie, removeCookies } from 'cookies-next';
import config from 'next/config';
import { create } from 'zustand';

const { publicRuntimeConfig } = config();

interface UseUserInfoStore {
  isLogin: boolean;
  info: UserInfo;
  turnsCount: {
    presence: number;
  };
  pending: boolean;
  setUserInfo: (info: any) => void;
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
  is_foreigner?: boolean;
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
  provider?: {
    job_title?: 'doctor';
    slug?: string;
  };
};

export const useUserInfoStore = create<UseUserInfoStore>((set, get) => ({
  isLogin: !!getCookie('certificate'),
  info: {},
  pending: true,
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info => {
    if (isPWA()) {
      firebaseCloudMessaging.init(info.id ?? '');
    }
    set(() => ({
      info: {
        ...info,
        cell: `0${info.cell}`,
        is_foreigner: info.is_foreigner == '1',
      },
      isLogin: true,
    }));
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
    clinicClient.get('/logout');
    set(() => ({
      info: {},
      isLogin: false,
    }));
  },
}));
