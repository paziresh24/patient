import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { splunkInstance } from '@/common/services/splunk';
import { isAllowedExternalUrl } from '@/modules/externalRedirect/allowedHosts';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useRef, useState } from 'react';

/**
 * Hand-off page for a result that lives outside paziresh24 (DR-09 external
 * profiles). Modelled on the interstitial Skyscanner shows before it sends a
 * traveller to an airline: say plainly that the platform is being left, name
 * where to, and let the patient stop.
 *
 * Why a page and not a bare external `href` on the card: the patient otherwise
 * lands on a stranger's site with no idea our result sent them there, and we
 * learn nothing about how many people we hand over or to whom. Both the view
 * and the departure are logged, which is what the daily hand-off report counts.
 */
const AUTO_FORWARD_SECONDS = 5;

interface GoPageProps {
  destination: string;
  destinationHost: string;
  title: string;
}

const GoPage = ({ destination, destinationHost, title }: GoPageProps) => {
  const router = useRouter();
  const [remaining, setRemaining] = useState(AUTO_FORWARD_SECONDS);
  const departed = useRef(false);

  const depart = (trigger: 'auto' | 'button') => {
    if (departed.current) return;
    departed.current = true;
    splunkInstance('search').sendEvent({
      group: 'search_external_redirect',
      type: 'search_external_redirect-depart',
      // `event` is the payload shape every other search event here uses; the
      // daily hand-off report groups by destination_host.
      event: { destination, destination_host: destinationHost, title, trigger },
    });
    window.location.replace(destination);
  };

  useEffect(() => {
    splunkInstance('search').sendEvent({
      group: 'search_external_redirect',
      type: 'search_external_redirect-view',
      event: { destination, destination_host: destinationHost, title },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (remaining <= 0) {
      depart('auto');
      return;
    }
    const timer = setTimeout(() => setRemaining(seconds => seconds - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const cancel = () => {
    departed.current = true;
    splunkInstance('search').sendEvent({
      group: 'search_external_redirect',
      type: 'search_external_redirect-cancel',
      event: { destination, destination_host: destinationHost, title },
    });
    router.back();
  };

  return (
    <>
      <Seo title="در حال انتقال به سایت دیگر | پذیرش۲۴" noIndex />
      <div className="flex justify-center w-full p-4">
        <div className="flex flex-col w-full max-w-lg p-6 space-y-5 text-center bg-white rounded-lg">
          <Text fontWeight="bold" fontSize="lg">
            شما در حال خروج از پذیرش۲۴ هستید
          </Text>
          <Text fontSize="sm" className="leading-7">
            نوبت‌دهی <b>{title}</b> در پذیرش۲۴ انجام نمی‌شود. برای گرفتن نوبت، به سایت خودِ این مرکز منتقل می‌شوید:
          </Text>
          <Text fontSize="sm" fontWeight="semiBold" className="break-all text-primary" dir="ltr">
            {destinationHost}
          </Text>
          <Text fontSize="xs" className="text-slate-500 leading-6">
            این سایت متعلق به پذیرش۲۴ نیست و ما مسئولیتی درباره‌ی محتوا، قیمت یا نوبت‌های آن نداریم.
          </Text>
          <div className="flex flex-col space-y-3">
            <Button onClick={() => depart('button')} variant="primary" block>
              ادامه و رفتن به سایت مرکز {remaining > 0 ? `(${remaining})` : ''}
            </Button>
            <Button onClick={cancel} variant="secondary" block>
              بازگشت به نتایج جستجو
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

GoPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} shouldShowPromoteApp={false} showBottomNavigation={false} className="bg-[#F2F3F5]">
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps: GetServerSideProps = withServerUtils(async (context: GetServerSidePropsContext) => {
  const destination = typeof context.query.u === 'string' ? context.query.u : '';
  const title = typeof context.query.n === 'string' ? context.query.n : 'این مرکز';

  // An unknown destination is a bug or an attack, never something to forward to:
  // send the patient back to search rather than off the platform.
  if (!isAllowedExternalUrl(destination)) {
    return { redirect: { destination: '/s/', permanent: false } };
  }

  return {
    props: {
      destination,
      destinationHost: new URL(destination).hostname,
      title,
    },
  };
});

export default GoPage;
