import { UserInfo } from '@/modules/login/store/userInfo';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDoctorRateStats } from '../apis/doctorRate';
import { useDoctorPageView } from '../apis/pageView';
import { useSanjeScore } from '../apis/sanjeScore';
import { DoctorHomeFeedStats } from '../types/feed';
import { isQueryInitialLoading } from '../utils/doctorHomeQuery';
import { useDoctorHomeContext } from './useDoctorHomeContext';

export const useDoctorHomeStats = (user?: UserInfo) => {
  const queryClient = useQueryClient();
  const { isDoctor, slug } = useDoctorHomeContext(user);
  const sanjeScore = useSanjeScore(isDoctor);
  const pageView = useDoctorPageView(slug);
  const rateStats = useDoctorRateStats(slug, isDoctor);

  // Ensure rate/pageView hit the network once slug is known (even if persisted cache exists).
  useEffect(() => {
    if (!isDoctor || !slug) return;
    void queryClient.refetchQueries({ queryKey: ['doctorHome', 'rateSummary', slug] });
    void queryClient.refetchQueries({ queryKey: ['doctorHome', 'pageView', slug] });
  }, [isDoctor, slug, queryClient]);

  const stats: DoctorHomeFeedStats = {
    performanceScore: sanjeScore.data?.final_score ?? null,
    isPerformanceLoading: isQueryInitialLoading(sanjeScore),
    satisfactionRating: rateStats.data?.rating ?? null,
    satisfactionReviewCount: rateStats.data?.rateCount ?? null,
    isSatisfactionLoading: isQueryInitialLoading(rateStats),
    todayAppointmentsCount: null,
    isTodayCountLoading: false,
    pageViewCount: pageView.data ?? null,
    isPageViewLoading: isQueryInitialLoading(pageView),
    slug,
  };

  return { slug, isDoctor, stats };
};
