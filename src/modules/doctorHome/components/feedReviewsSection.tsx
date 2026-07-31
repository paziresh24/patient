import Skeleton from '@/common/components/atom/skeleton';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useDoctorHomeReviewsFeed } from '../hooks/useDoctorHomeReviewsFeed';
import { ReviewsFeedItem } from './feedItem';

export const FeedReviewsSection = () => {
  const user = useUserInfoStore(state => state.info);
  const { items, slug, doctorUserId, isInitialLoading } = useDoctorHomeReviewsFeed(user);

  if (isInitialLoading && items.length === 0) {
    return <Skeleton h="7rem" w="100%" rounded="lg" className="opacity-30" />;
  }

  if (items.length === 0) return null;

  return <ReviewsFeedItem data={{ items, slug, doctorUserId }} />;
};
