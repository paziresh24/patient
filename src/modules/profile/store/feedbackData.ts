import { create } from 'zustand';
import { Feedbacks } from '../../rate/components/feedbackCard/feedbackCard';

interface FeedbackDataStore {
  data: Partial<Feedbacks[]>;
  setData: (data: Partial<Feedbacks[]>) => void;
  toggleLike: (id: string) => void;
}

export const useFeedbackDataStore = create<FeedbackDataStore>((set, get) => ({
  data: [],
  setData: data =>
    set(() => ({
      data,
    })),
  toggleLike: id =>
    set(() => ({
      data: get().data.map((item: any) =>
        item?.id === id
          ? {
              ...item,
              isLiked: !item?.isLiked,
              like: !item?.isLiked ? +item.like + 1 : +item.like - 1,
            }
          : item,
      ),
    })),
}));
