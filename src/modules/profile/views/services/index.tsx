import Card from '@/common/components/atom/card/card';
import Text from '@/common/components/atom/text/text';
import useServerQuery from '@/common/hooks/useServerQuery';
import { CENTERS } from '@/common/types/centers';
import Recommend from '@/modules/booking/components/recommend/recommend';
import moment from 'jalali-moment';
import { useRouter } from 'next/router';
import { useProfileSplunkEvent } from '../../hooks/useProfileEvent';
import External from './external';
import { OnlineVisitWrapper } from './onlineVisitWrapper';
import Presence from './presence';

export const Services = ({ doctor, isBulk, slug, className }: { doctor: any; isBulk: boolean; slug: string; className?: string }) => {
  const router = useRouter();
  const university = useServerQuery(state => state.queries.university);
  const { recommendEvent } = useProfileSplunkEvent();

  return (
    <>
      {!isBulk && doctor?.id === '540' && (
        <External
          title="ویزیت آنلاین (غیر فعال)"
          buttonText="ورود به سایت دکتر پروفسور محمد تقی نوربالا"
          description={`در حال حاضر ویزیت آنلاین این پزشک در پذیرش 24 <strong>غیرفعال</strong> می باشد! شما میتوانید با کلیک بر روی دکمه زیر، از طریق سایت تخصصی این پزشک، نوبت ویزیت آنلاین دریافت کنید.`}
          onBook={() => location.assign('http://drnoorbala.ir/')}
        />
      )}
      {!isBulk &&
        doctor?.consult_active_booking &&
        doctor?.centers
          .find((center: any) => center.id === CENTERS.CONSULT)
          ?.services?.map((service: any) => (
            <OnlineVisitWrapper
              key={service.id}
              channelType={doctor?.online_visit_channels?.[0]?.type === 'igap' ? 'igap' : 'phone'}
              title={service.desk}
              price={service.free_price}
              duration={
                doctor.group_expertises[0].id === 21 || doctor.group_expertises[0].id === 47
                  ? moment.duration(service.duration).locale('fa').humanize()
                  : undefined
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
      {!isBulk && doctor?.centers?.some((center: any) => center.id !== CENTERS.CONSULT) && (
        <Presence
          centers={doctor.centers.filter((center: any) => center.id !== CENTERS.CONSULT)}
          waitingTime={doctor.waiting_time_info?.waiting_time_title}
          onBook={({ centerId, serviceId }) => router.push(`/booking/${slug}?centerId=${centerId}&serviceId=${serviceId}`)}
          displayName={doctor.display_name}
        />
      )}
      {isBulk && (
        <Card className="!rounded-none md:!rounded-lg">
          <Text fontWeight="bold" fontSize="sm">
            نوبت دهی این پزشک در پذیرش24 غیر فعال می باشد. شما میتوانید از پزشکان حاذق در این حوزه نوبت بگیرید.
          </Text>
        </Card>
      )}
      {doctor?.should_recommend_other_doctors && doctor.centers[0] && doctor?.expertises?.[0] && !university && (
        <div className="flex flex-col space-y-3 md:hidden">
          <Text fontWeight="bold" className="px-4 leading-6 md:px-0 line-clamp-1">
            برترین پزشکان {doctor.expertises[0].expertise_groups[0].name} {doctor.centers[0].city ? `در ${doctor.centers[0].city}` : null}{' '}
            <Text fontWeight="medium" fontSize="sm">
              از دیدگاه بیماران
            </Text>
          </Text>
          <Recommend
            doctorId={doctor.id}
            city={doctor.city_en_slug}
            category={doctor.expertises[0]?.expertise_groups[0].en_slug}
            className="pr-4 md:pr-0"
            clickRecommendEvent={doctor => {
              recommendEvent('clickrecommend', {
                recommendations: doctor,
              });
            }}
          />
        </div>
      )}
    </>
  );
};

export default Services;
