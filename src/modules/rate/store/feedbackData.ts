import create from 'zustand';
import { Feedbacks } from '../components/feedbackCard/feedbackCard';

interface FeedbackDataStore {
  data: Partial<Feedbacks[]>;
  setData: (data: Partial<Feedbacks[]>) => void;
}

export const useFeedbackDataStore = create<FeedbackDataStore>(set => ({
  data: [],
  setData: data =>
    set(() => ({
      data,
    })),
}));
