const Card = dynamic(() => import('@/common/components/atom/card'));
import Button from '@/common/components/atom/button/button';
import useResponsive from '@/common/hooks/useResponsive';
import useWebView from '@/common/hooks/useWebView';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import humanizeTime from '@/common/utils/humanizeTime';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { uniqMessengers } from '@/modules/booking/functions/uniqMessengers';
import { useFeatureValue } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
const OnlineVisitWrapper = dynamic(() => import('./onlineVisitWrapper'));
const Recommend = dynamic(() => import('@/modules/booking/components/recommend'));
const Presence = dynamic(() => import('./presence'));
const External = dynamic(() => import('./external'));

export const Services = ({ doctor, slug, className }: { doctor: any; slug: string; className?: string }) => {
  const router = useRouter();
  const messengers = useFeatureValue<any>('channeldescription', {});
  const doctorMessenger = uniqMessengers(doctor?.online_visit_channel_types, Object.keys(messengers));
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });
  const { isMobile } = useResponsive();
  const isWebView = useWebView();

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
            onBook={({ centerId, serviceId }) => router.push(`/booking/${slug}?centerId=${centerId}&serviceId=${serviceId}`)}
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
