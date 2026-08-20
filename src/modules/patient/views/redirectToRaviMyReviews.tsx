import Loading from '@/common/components/atom/loading';
import { buildRaviMyReviewsUrl } from '@/modules/patient/utils/buildRaviMyReviewsUrl';
import { getCookie } from 'cookies-next';
import { useLayoutEffect } from 'react';

function readToken(): string | undefined {
  const token = getCookie('token');
  return typeof token === 'string' && token.trim() ? token.trim() : undefined;
}

/** Hard-navigate to ravi-front my-reviews (p24cloud cannot read *.paziresh24.com cookies). */
export function goToRaviMyReviews(): void {
  if (typeof window === 'undefined') return;
  window.location.replace(buildRaviMyReviewsUrl(readToken()));
}

/** Cross-site: p24cloud cannot read *.paziresh24.com cookies; pass token once. */
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
