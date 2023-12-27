import { clinicClient } from '@/common/apis/client';
import { removeCookies } from 'cookies-next';
import { growthbook } from 'src/pages/_app';
import { create } from 'zustand';

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
      return {
        info: {
          ...info,
          cell: `0${info.cell}`,
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
    clinicClient.get('/logout');
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      user_id: undefined,
      is_doctor: false,
    });
    set(() => ({
      info: {},
      isLogin: false,
    }));
  },
}));
