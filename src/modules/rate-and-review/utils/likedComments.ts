export interface LikedComment {
  user_id: string | number;
  id: string;
  rate: number;
}

const STORAGE_KEY = 'likedComments';

export const getLikedComments = (): LikedComment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LikedComment[]) : [];
  } catch {
    return [];
  }
};

export const getUserLikeRate = (feedbackId: string, userId: string | number): number => {
  const entry = getLikedComments().find(
    comment => comment.id === feedbackId && String(comment.user_id) === String(userId),
  );
  return entry?.rate ?? 0;
};

export const saveLikedComment = (entry: LikedComment) => {
  if (typeof window === 'undefined') return;
  const list = getLikedComments();
  const index = list.findIndex(
    comment => comment.id === entry.id && String(comment.user_id) === String(entry.user_id),
  );
  if (index !== -1) {
    list[index] = entry;
  } else {
    list.push(entry);
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
