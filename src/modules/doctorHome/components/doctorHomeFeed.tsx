import classNames from '@/common/utils/classNames';
import { DoctorHomeFeedItem } from '../types/feed';
import { FeedGreeting } from './feedGreeting';
import { FeedItem } from './feedItem';

interface DoctorHomeFeedProps {
  items: DoctorHomeFeedItem[];
  className?: string;
}

export const DoctorHomeFeed = ({ items, className }: DoctorHomeFeedProps) => {
  const statsItem = items.find((item): item is Extract<DoctorHomeFeedItem, { type: 'stats' }> => item.type === 'stats');
  const appointmentsItem = items.find((item): item is Extract<DoctorHomeFeedItem, { type: 'appointments_list' }> => item.type === 'appointments_list');
  const reviewsItem = items.find((item): item is Extract<DoctorHomeFeedItem, { type: 'reviews_list' }> => item.type === 'reviews_list');
  const feedItems = items.filter(item => item.type !== 'stats');

  return (
    <div className={classNames('flex flex-col gap-8', className)}>
      <FeedGreeting
        stats={statsItem?.data}
        appointments={appointmentsItem?.data}
        reviews={reviewsItem?.data}
      />
      {feedItems.map(item => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  );
};
