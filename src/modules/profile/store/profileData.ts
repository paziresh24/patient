import { Center, DoctorParams } from '@/common/types/doctorParams';
import { create } from 'zustand';

interface ProfileDataStore {
  data: Partial<DoctorParams>;
  centers: Center[];
  isBulk: boolean;
  setData: (data: Partial<DoctorParams>) => void;
}

export const useProfileDataStore = create<ProfileDataStore>(set => ({
  data: {},
  centers: [],
  isBulk: false,
  setData: data =>
    set(() => ({
      data,
      centers: data.centers,
    })),
}));
