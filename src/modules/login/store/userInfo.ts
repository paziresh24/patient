import { getCookie } from 'cookies-next';
import create from 'zustand';

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
};

export const useUserInfoStore = create<UseUserInfoStore>(set => ({
  isLogin: !!getCookie('certificate'),
  info: {},
  pending: true,
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info =>
    set(() => ({
      info: {
        ...info,
        is_foreigner: info.is_foreigner == '1',
      },
      isLogin: true,
    })),
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
}));
