import { Center, DoctorParams } from '@/common/types/doctorParams';
import { create } from 'zustand';

interface ProfileDataStore {
  data: Partial<DoctorParams>;
  centers: Center[];
  messenger: string[];
  isBulk: boolean;
  setData: (data: Partial<DoctorParams>) => void;
}

export const useProfileDataStore = create<ProfileDataStore>(set => ({
  data: {},
  centers: [],
  isBulk: false,
  messenger: [],
  setData: data =>
    set(() => ({
      data,
      centers: data?.centers,
      messenger: data?.online_visit_channel_types ?? [],
    })),
}));
