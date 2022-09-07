import create from 'zustand';

interface SearchStore {
  city: City;
  setCity: (city: City) => void;
  userSearchValue: string;
  setUserSearchValue: (value: string) => void;
}

type City = {
  name: string;
  id: string;
};

export const useSearchStore = create<SearchStore>(set => ({
  city: {
    id: '-1',
    name: 'همه ایران',
    en_slug: 'ir',
  },
  userSearchValue: '',
  setCity: city =>
    set(state => ({
      ...state,
      city,
    })),
  setUserSearchValue: userSearchValue =>
    set(state => ({
      ...state,
      userSearchValue,
    })),
}));
