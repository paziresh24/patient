import Card from '@/common/components/atom/card/card';
import Text from '@/common/components/atom/text/text';
import { CENTERS } from '@/common/types/centers';
import PhoneNumberList from '@/modules/booking/components/phoneNumberList/phoneNumberList';
import Recommend from '@/modules/booking/components/recommend/recommend';
import moment from 'jalali-moment';
import { useRouter } from 'next/router';
import External from './external';
import { OnlineVisitWrapper } from './onlineVisitWrapper';
import Presence from './presence';

export const Services = ({ doctor, isBulk, slug, className }: { doctor: any; isBulk: boolean; slug: string; className?: string }) => {
  const router = useRouter();
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
        />
      )}
      {isBulk && (
        <Card className="!rounded-none md:!rounded-lg">
          <Text fontWeight="bold" fontSize="sm">
            نوبت‌دهی اینترنتی این پزشک غیرفعال می‌باشد!
          </Text>
          <PhoneNumberList phoneNumbers={doctor.centers[0].display_number_array} />
        </Card>
      )}
      {doctor?.expertises?.[0] && doctor?.should_recommend_other_doctors && (
        <>
          <Text fontWeight="bold" className="px-4 leading-6 md:px-0">
            برترین پزشکان {doctor.expertises[0].expertise_groups[0].name} {doctor.centers[0].city ? `در ${doctor.centers[0].city}` : null}{' '}
            <Text fontWeight="medium" fontSize="sm">
              از دیدگاه بیماران
            </Text>
          </Text>
          <Recommend
            doctorId={doctor.id}
            city={doctor.city_en_slug}
            category={doctor.expertises[0]?.expertise_groups[0].en_slug}
            className="px-0 "
          />
        </>
      )}
    </>
  );
};

export default Services;
