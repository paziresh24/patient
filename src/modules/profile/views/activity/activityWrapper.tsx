import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import AwardIcon from '@/common/components/icons/award';
import ChatIcon from '@/common/components/icons/chat';
import SuccessIcon from '@/common/components/icons/success';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { useFeatureValue } from '@growthbook/growthbook-react';
import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import { appointmentsCount } from '../../apis/appointmentsCount';
import Activity from './activity';

interface ActivityProps {
  className?: string;
  history: any;
  displayName?: string;
  onlineVisitUserCenterId?: string;
  onlineVisitEnabled?: boolean;
  slug: string;
}

export const ActivityWrapper = (props: ActivityProps) => {
  const { className, history, displayName, onlineVisitUserCenterId: visitOnlineUserCenterId, onlineVisitEnabled, slug } = props;
  const showDeletedBooksRateDoctorList = useFeatureValue('profile:show-deleted-books-rate|doctor-list', { slugs: [''] });
  const shouldShowDeletedBooksRate = newApiFeatureFlaggingCondition(showDeletedBooksRateDoctorList.slugs, slug);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [deletedBookRate, setDeletedBookRate] = useState('');

  const deletedBooksRateHandler = async () => {
    setIsLoading(true);
    const [allBooksCountData, deletedBooksCountData] = await Promise.allSettled([
      await appointmentsCount({
        user_center_id: visitOnlineUserCenterId,
        payment_status_in: [3, 4, 5, 6, 7, 8, 9],
        from_less_than: moment().startOf('jDay').unix(),
        from_greather_than: moment().subtract(30, 'jDay').startOf('jDay').unix(),
      }),
      await appointmentsCount({
        user_center_id: visitOnlineUserCenterId,
        payment_status_in: [4],
        from_less_than: moment().startOf('jDay').unix(),
        from_greather_than: moment().subtract(30, 'jDay').startOf('jDay').unix(),
        deleted_at_greater_than: 'from',
      }),
    ]);
    if (allBooksCountData.status === 'fulfilled' && deletedBooksCountData.status === 'fulfilled') {
      setIsLoading(false);
      setDeletedBookRate(
        `${Math.ceil(
          100 -
            ((+deletedBooksCountData.value?.data?.count_book ? +deletedBooksCountData.value?.data?.count_book : 0) /
              (+allBooksCountData.value?.data?.count_book ? +allBooksCountData.value?.data?.count_book : 1)) *
              100,
        )}%`,
      );
      return;
    }
    setIsError(true);
  };

  useEffect(() => {
    shouldShowDeletedBooksRate && deletedBooksRateHandler();
  }, [shouldShowDeletedBooksRate]);

  const items = [
    history?.count_of_consult_books && {
      icon: <ChatIcon className="min-w-fit w-max" />,
      text: `<b>${history?.count_of_consult_books}</b> مشاوره فعال`,
    },
    !isError &&
      onlineVisitEnabled &&
      shouldShowDeletedBooksRate && {
        icon: <SuccessIcon className="min-w-fit w-6 h-6" />,
        text: (
          <Text fontSize="sm" className="align-middle flex items-center">
            {isLoading ? (
              <Skeleton h="1rem" w="2rem" rounded="full" className="inline-block ml-1 bg-slate-300" />
            ) : (
              <b className="ml-1"> {deletedBookRate}</b>
            )}
            ویزیت آنلاین موفق
          </Text>
        ),
        hint: 'این شاخص براساس تعداد ویزیت آنلاینی که پس از زمان نوبت با موفقیت انجام شده‌اند و حذف نشده‌اند محاسبه می‌شود.',
      },
    {
      icon: <AwardIcon className="min-w-fit w-max" />,
      text: `پذیرش24 بیش از ${history?.insert_at_age} افتخار میزبانی از صفحه اختصاصی ${displayName} را داشته است.`,
    },
  ].filter(Boolean);

  return <Activity className={className} items={items} />;
};
