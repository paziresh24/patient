import Loading from '@/common/components/atom/loading';
import { buildRaviMyReviewsUrl } from '@/modules/patient/utils/buildRaviMyReviewsUrl';
import { getCookie } from 'cookies-next';
import { useEffect } from 'react';

/** Cross-site: p24cloud cannot read *.paziresh24.com cookies; pass token once. */
export const RedirectToRaviMyReviews = () => {
  useEffect(() => {
    const token = getCookie('token');
    window.location.assign(buildRaviMyReviewsUrl(typeof token === 'string' ? token : undefined));
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-[40vh] px-4 py-10">
      <Loading />
    </div>
  );
};
