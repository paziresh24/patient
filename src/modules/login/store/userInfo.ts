import create from 'zustand';

interface IUseUserInfoStore {
  isLogin: boolean;
  info: {
    name?: string;
    family?: string;
    user_id?: string;
    username?: string;
  };
  pending: boolean;
  setUserInfo: (info: any) => void;
  removeInfo: () => void;
  setPending: (state: boolean) => void;
}

export const useUserInfoStore = create<IUseUserInfoStore>(set => ({
  isLogin: false,
  info: {},
  pending: true,
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
}));
