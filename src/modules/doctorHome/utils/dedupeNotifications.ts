import { DoctorHomeFeedAlert } from '../types/feed';

export const dedupeNotifications = (items: DoctorHomeFeedAlert[]) => {
  const seen = new Set<string>();

  return items.filter(item => {
    if (item.id != null) {
      const key = `id:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }

    const key = `${item.title?.trim() ?? ''}|${item.description?.trim() ?? ''}|${item.created_at ?? ''}`;
    if (!key || key === '||' || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
