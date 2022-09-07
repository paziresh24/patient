import create from 'zustand';

interface IUseUserInfoStore {
  isLogin: boolean;
  info: {
    name?: string;
    family?: string;
    user_id?: string;
    username?: string;
    national_code?: string;
    gender?: 'male' | 'female';
    city_id?: string;
    province_id?: string;
    image?: string;
  };
  turnsCount: {
    presence: number;
  };
  pending: boolean;
  setUserInfo: (info: any) => void;
  removeInfo: () => void;
  setPending: (state: boolean) => void;
  setTurnsCount: (turnsCount: { presence: number }) => void;
}

export const useUserInfoStore = create<IUseUserInfoStore>(set => ({
  isLogin: false,
  info: {},
  pending: true,
  turnsCount: {
    presence: 0,
  },
  setUserInfo: info =>
    set(() => ({
      info,
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
