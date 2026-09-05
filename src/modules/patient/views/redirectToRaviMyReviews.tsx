import Loading from '@/common/components/atom/loading';
import { buildRaviMyReviewsHandoffSrc } from '@/modules/patient/utils/buildRaviMyReviewsHandoff';
import { useLayoutEffect } from 'react';

/** Same-origin handoff so the httpOnly session cookie reaches Next.js. */
export function goToRaviMyReviews(): void {
  if (typeof window === 'undefined') return;
  window.location.replace(buildRaviMyReviewsHandoffSrc());
}

export const RedirectToRaviMyReviews = () => {
  useLayoutEffect(() => {
    goToRaviMyReviews();
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-[40vh] px-4 py-10">
      <Loading />
    </div>
  );
};
