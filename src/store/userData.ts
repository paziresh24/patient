import create from "zustand";

interface UserDataStore {
  user: ProfileData;
  setUser: (data: ProfileData) => void;
}

type ProfileData = {
  name?: string;
};

export const useUserDataStore = create<UserDataStore>((set) => ({
  user: {},
  setUser: (user) =>
    set(() => ({
      user,
    })),
}));
