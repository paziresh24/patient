import create from 'zustand';

interface UseBookingStore {
  center: Center;
  turnTime: {
    requestCode: string;
  };
  setCenter: (info: Center) => void;
  setTurnTime: (turnTime: { requestCode: string }) => void;
}

type Center = { centerId: string; serviceId: string; userCenterId: string; serverId: string };

export const useBookingStore = create<UseBookingStore>(set => ({
  center: {
    centerId: '',
    serverId: '',
    serviceId: '',
    userCenterId: '',
  },
  turnTime: {
    requestCode: '',
  },
  setCenter: center => {
    set(state => ({
      ...state,
      center,
    }));
  },
  setTurnTime: turnTime => {
    set(state => ({
      ...state,
      turnTime,
    }));
  },
}));
