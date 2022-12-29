import { useRouter } from 'next/router';
import create from 'zustand';

const useUniversityStore = create<{ university: string; setUniversity: (university: string) => void }>(set => ({
  university: '',
  setUniversity: university =>
    set(state => ({
      ...state,
      university,
    })),
}));
export const useUniversity = () => {
  const { query } = useRouter();
  const { university, setUniversity } = useUniversityStore();

  if (!university && query.university) setUniversity(query.university as string);

  return university;
};
