import { Center, DoctorParams } from '@/common/types/doctorParams';
import create from 'zustand';

interface ProfileDataStore {
  data: Partial<DoctorParams>;
  selectedCenter: Center;
  setData: (data: Partial<DoctorParams>) => void;
  setSelectedCenter: (selectedCenter: Center) => void;
}

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
