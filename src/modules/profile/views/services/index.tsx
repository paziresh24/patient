import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import useResponsive from '@/common/hooks/useResponsive';
import useWebView from '@/common/hooks/useWebView';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import humanizeTime from '@/common/utils/humanizeTime';
import { isNativeWebView } from '@/common/utils/isNativeWebView';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { uniqMessengers } from '@/modules/booking/functions/uniqMessengers';
import { useFeatureValue } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import queryStirng from 'querystring';
import { useInView } from 'react-intersection-observer';
const OnlineVisitWrapper = dynamic(() => import('./onlineVisitWrapper'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="198px" rounded="lg" />;
  },
});
const Presence = dynamic(() => import('./presence'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="198px" rounded="lg" />;
  },
});
const External = dynamic(() => import('./external'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="198px" rounded="lg" />;
  },
});

export const Services = ({
  id,
  doctor,
  expertises,
  centers,
  slug,
  onlineVisit,
  waitingTimeInfo,
}: {
  id: string;
  expertises: any;
  doctor: any;
  centers: any[];
  slug: string;
  onlineVisit: any;
  waitingTimeInfo: any;
}) => {
  const router = useRouter();
  const messengers = useFeatureValue<any>('channeldescription', {});
  const doctorMessenger = uniqMessengers(onlineVisit?.channels, Object.keys(messengers));
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });
  const { isMobile } = useResponsive();
  const isWebView = useWebView();

  const handleOpenBookingPage = (
    slug: string,
    centerId: string,
    serviceId: string,
    provider_id?: string,
    user_id?: string,
    city_name?: string,
  ) => {
    const isBookRequest = centers
      ?.find?.(center => center.id === centerId)
      ?.services?.find?.((service: { id: string }) => service.id === serviceId)?.can_request;

    const params = {
      centerId,
      serviceId,
      cityName: city_name,
      ...(provider_id && user_id && { providerId: provider_id, userId: user_id }),
      ...(isBookRequest && { timeId: '-1' }),
    };

    if (isNativeWebView()) {
      if (isBookRequest) return location.assign(`/booking/${slug}?${queryStirng.stringify({ ...params, openInBrowser: 1 })}`);
    }

    router.push(`/booking/${slug}?${queryStirng.stringify({ ...params })}`);
  };

  return (
    <>
      <div ref={servicesRef} className="flex flex-col space-y-3">
        {id === '540' && (
          <External
            title="ویزیت آنلاین (غیر فعال)"
            buttonText="ورود به سایت دکتر پروفسور محمد تقی نوربالا"
            description={`در حال حاضر ویزیت آنلاین این پزشک در پذیرش 24 <strong>غیرفعال</strong> می باشد! شما میتوانید با کلیک بر روی دکمه زیر، از طریق سایت تخصصی این پزشک، نوبت ویزیت آنلاین دریافت کنید.`}
            onBook={() => location.assign('http://drnoorbala.ir/')}
          />
        )}
        {onlineVisit.enabled &&
          centers
            .find((center: any) => center.id === CENTERS.CONSULT)
            ?.services?.map((service: any) => (
              <OnlineVisitWrapper
                key={service.id}
                channelType={doctorMessenger?.length ? doctorMessenger : ['phone']}
                title="همین الان آنلاین ویزیت شوید"
                price={service.free_price}
                duration={
                  expertises.group_expertises[0].id === 21 || expertises.group_expertises[0].id === 47
                    ? humanizeTime(service.duration)
                    : undefined
                }
                doctorId={doctor.id}
                waitingTime={waitingTimeInfo?.find?.((center: any) => center?.center_id === CENTERS.CONSULT) ?? {}}
                slug={slug}
                fullName={doctor.display_name}
                id={service.id}
                userCenterId={centers?.find((center: any) => center.id === CENTERS.CONSULT)?.user_center_id}
                city={{
                  name: centers[0].city,
                  slug: doctor.city_en_slug,
                }}
                expertise={{
                  name: expertises.group_expertises?.[0]?.name,
                  slug: expertises.group_expertises?.[0]?.en_slug,
                }}
              />
            ))}
        {centers?.some((center: any) => center.id !== CENTERS.CONSULT) && (
          <Presence
            centers={centers.filter((center: any) => center.id !== CENTERS.CONSULT)}
            waitingTime={waitingTimeInfo?.find?.((center: any) => center?.center_id !== CENTERS.CONSULT)?.waiting_time_title}
            onBook={({ centerId, serviceId }) =>
              handleOpenBookingPage(slug, centerId, serviceId, doctor.provider_id, doctor.user_id, doctor.city_en_slug)
            }
            displayName={doctor.display_name}
          />
        )}
      </div>

      {isMobile && !inViewServices && (
        <div
          className={classNames('fixed z-50 w-full p-3 bg-white border-t bottom-16 shadow-card border-slate-100', {
            'bottom-0': isWebView,
          })}
        >
          <Button onClick={() => scrollIntoViewWithOffset('#services_section', 90)} block>
            دریافت نوبت
          </Button>
        </div>
      )}
    </>
  );
};

export default Services;
