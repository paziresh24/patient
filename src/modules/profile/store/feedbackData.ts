import create from 'zustand';
import { Feedbacks } from '../../rate/components/feedbackCard/feedbackCard';

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
