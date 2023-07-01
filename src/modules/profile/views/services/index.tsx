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
import { Center } from '@/modules/booking/types/selectCenter';
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

export const Services = ({ doctor, slug }: { doctor: any; slug: string }) => {
  const router = useRouter();
  const messengers = useFeatureValue<any>('channeldescription', {});
  const doctorMessenger = uniqMessengers(doctor?.online_visit_channel_types, Object.keys(messengers));
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });
  const { isMobile } = useResponsive();
  const isWebView = useWebView();

  const handleOpenBookingPage = (slug: string, centerId: string, serviceId: string) => {
    const isBookRequest = (doctor.centers as Center[])
      ?.find?.(center => center.id === centerId)
      ?.services?.find?.(service => service.id === serviceId)?.can_request;

    const params = {
      centerId,
      serviceId,
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
        {doctor?.id === '540' && (
          <External
            title="ویزیت آنلاین (غیر فعال)"
            buttonText="ورود به سایت دکتر پروفسور محمد تقی نوربالا"
            description={`در حال حاضر ویزیت آنلاین این پزشک در پذیرش 24 <strong>غیرفعال</strong> می باشد! شما میتوانید با کلیک بر روی دکمه زیر، از طریق سایت تخصصی این پزشک، نوبت ویزیت آنلاین دریافت کنید.`}
            onBook={() => location.assign('http://drnoorbala.ir/')}
          />
        )}
        {doctor?.consult_active_booking &&
          doctor?.centers
            .find((center: any) => center.id === CENTERS.CONSULT)
            ?.services?.map((service: any) => (
              <OnlineVisitWrapper
                key={service.id}
                channelType={doctorMessenger?.length ? doctorMessenger : ['phone']}
                title={service.desk}
                price={service.free_price}
                duration={
                  doctor.group_expertises[0].id === 21 || doctor.group_expertises[0].id === 47 ? humanizeTime(service.duration) : undefined
                }
                doctorId={doctor.id}
                slug={slug}
                id={service.id}
                userCenterId={doctor.centers?.find((center: any) => center.id === CENTERS.CONSULT)?.user_center_id}
                city={{
                  name: doctor.centers[0].city,
                  slug: doctor.city_en_slug,
                }}
                expertise={{
                  name: doctor.expertises[0]?.expertise_groups[0]?.name,
                  slug: doctor.expertises[0]?.expertise_groups[0]?.en_slug,
                }}
              />
            ))}
        {doctor?.centers?.some((center: any) => center.id !== CENTERS.CONSULT) && (
          <Presence
            centers={doctor.centers.filter((center: any) => center.id !== CENTERS.CONSULT)}
            waitingTime={doctor.waiting_time_info?.waiting_time_title}
            onBook={({ centerId, serviceId }) => handleOpenBookingPage(slug, centerId, serviceId)}
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
