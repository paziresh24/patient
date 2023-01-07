import create from 'zustand';

export const useServerQuery = create<{ queries: any; setQueries: (queries: any) => void }>(set => ({
  queries: {},
  setQueries: queries => {
    if (!queries) return;

    return set(state => ({
      ...state,
      queries,
    }));
  },
}));

export default useServerQuery;
