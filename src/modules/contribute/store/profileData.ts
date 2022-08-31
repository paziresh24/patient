import create from 'zustand';

interface ProfileDataStore {
  data: ProfileData;
  selectedCenter: Center;
  setData: (data: ProfileData) => void;
  setSelectedCenter: (selectedCenter: Center) => void;
}

type ProfileData = {
  centers?: Center[];
  display_name?: string;
};

export type Center = {
  id?: string;
  name?: string;
  server_id?: string;
  address?: string;
  center_type?: number;
  tell_array?: string[];
  province?: string;
  city?: string;
  map?: {
    lat?: number;
    lon?: number;
  };
};

export const useProfileDataStore = create<ProfileDataStore>(set => ({
  data: {},
  selectedCenter: {},
  setData: data =>
    set(() => ({
      data,
    })),
  setSelectedCenter: selectedCenter =>
    set(() => ({
      selectedCenter,
    })),
}));
