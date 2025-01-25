import Button from '@/common/components/atom/button/button';
import EditIcon from '@/common/components/icons/edit';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CentersInfo from './centersInfo';
import Services from './services';
import pick from 'lodash/pick';
import { Fragment } from '@/common/fragment';
import BookingGlobalContextsProvider from '../../../../.plasmic/plasmic/paziresh_24_booking/PlasmicGlobalContextsProvider';
import { FragmentRateReview } from './rateReview/fragmentRateReview';

const RecommendWrapper = dynamic(() => import('./recommend'));

export const aside = (data: any) => {
  const {
    information,
    centers,
    expertises,
    feedbacks,
    media,
    history,
    symptomes,
    similarLinks,
    customize,
    editable,
    handleViewAs,
    seo,
    isBulk,
    onlineVisit,
    waitingTimeInfo,
    fragmentComponents,
    hamdast,
  } = data;

  const profileData = pick(data, [
    'information',
    'centers',
    'expertises',
    'feedbacks',
    'media',
    'waitingTimeInfo',
    'history',
    'symptomes',
    'seo',
    'onlineVisit',
  ]);

  return [
    {
      id: 'book-me',
      isShow: centers?.length > 0,
      function: () => {
        return {
          id: information.id,
          doctor: information,
          expertises,
          onlineVisit,
          centers,
          waitingTimeInfo,
          slug: seo.slug,
          profileData,
          isBulk,
        };
      },
      children: (props: any) =>
        fragmentComponents?.bookingServiceList?.hide === false ? (
          <BookingGlobalContextsProvider>
            <Fragment
              name="BookingServiceList"
              props={{
                slug: seo.slug,
              }}
            />
          </BookingGlobalContextsProvider>
        ) : (
          <Services {...props} />
        ),
    },
    {
      id: 'ga',
      isShow: !!hamdast.ga,
      children: (props: any) => (
        <iframe
          src={`https://hamdast.paziresh24.com/bridge/?app=xxdfcqqubwkgo5d&page=n3nhsc879uzzh9z&src=${encodeURIComponent(
            `https://ga.fragm.site/?doctor_id=${information.id}&slug=${seo.slug}`,
          )}`}
        ></iframe>
      ),
    },
    // Rcommend
    {
      isShow: information?.should_recommend_other_doctors && centers[0] && expertises?.expertises?.[0],
      function: () => {
        return {
          doctorId: information.id,
          city: { name: centers[0].city, en_slug: information.city_en_slug },
          groupExpertise: expertises.group_expertises[0],
          expertises: expertises.expertises,
          clickRecommendEvent: (doctor: any, elementName?: string, elementContent?: string) => {
            splunkInstance('doctor-profile').sendEvent({
              group: 'recommend',
              type: 'clickrecommend',
              event: {
                data: {
                  terminal_id: getCookie('terminal_id'),
                  user_agent: window.navigator.userAgent,
                  page_url: window.location.pathname,
                  referrer: document.referrer,
                  group_expertises: expertises.group_expertises?.[0]?.name ?? 'سایر',
                  doctor_name: information.display_name,
                  centers_types: centers.map((center: any) => center.center_type_name),
                  server_id: information.server_id,
                  recommendations: doctor,
                  element_name: elementName,
                  element_content: elementContent,
                },
              },
            });
          },
        };
      },
      children: (props: any) => <RecommendWrapper {...props} />,
      dataAttributes: { 'data-nosnippet': 'true' },
    },
    // Reviews
    {
      id: 'reviews',
      isShow: customize.showRateAndReviews && fragmentComponents?.raviComponentTopOrderProfile,
      children: (props: any) => (
        <div className="md:hidden flex flex-col gap-y-3">
          {!fragmentComponents?.rateAndReviews && <h2 className="font-bold px-4 md:px-0">نظرات در مورد {information.display_name}</h2>}
          <FragmentRateReview fragmentComponents={fragmentComponents} profileData={profileData} />
        </div>
      ),
    },
    // Centers Info
    {
      id: 'phone-and-address',
      isShow: centers.some((center: any) => center.id !== CENTERS.CONSULT),
      ...(fragmentComponents?.addresses?.hide === true && {
        title: 'آدرس و تلفن تماس',
        ActionButton: customize.showContribute && !editable && (
          <Link href={`/patient/contribute/?slug=${seo.slug}&test_src=profile_eslah`} prefetch={false}>
            <Button variant="text" size="sm" className="flex text-xs font-semibold h-9 gap-x-1 text-primary">
              <EditIcon width={17} height={17} />
              گزارش تلفن و آدرس صحیح
            </Button>
          </Link>
        ),
      }),
      function: () => {
        return {
          centers: centers
            .filter((center: any) => center.id !== CENTERS.CONSULT)
            .map((center: any) => ({
              id: center.id,
              userCenterId: center.user_center_id,
              address: center.address,
              city: center.city,
              slug: center.center_type === 1 ? `/dr/${seo.slug}` : `/center/${center.slug}`,
              description: center.description,
              phoneNumbers: center?.display_number_array,
              name: center.center_type !== 1 ? center.name : `مطب ${information?.display_name}`,
              location: center.map,
            })),
          onEventPhoneNumber: (centerId: any) => {
            const center = centers.find((center: any) => center.id === centerId);
            splunkInstance('doctor-profile').sendEvent({
              group: 'doctor profile',
              type: 'see center phone',
              event: {
                data: {
                  doctor: {
                    full_name: information.display_name,
                    server_id: information.server_id,
                    slug: seo.slug,
                    id: information.id,
                    expertise: expertises.expertises[0].alias_title,
                    group_expertise: expertises.group_expertises[0].name,
                  },
                  center: {
                    center_status: center?.status,
                    center_type: center?.center_type,
                    center_name: center?.name,
                    city_en_slug: center?.city_en_slug,
                  },
                  user: {
                    terminal_id: getCookie('terminal_id'),
                  },
                },
              },
            });
          },
          onEventAddress: (centerId: any) => {
            const center = centers.find((center: any) => center.id === centerId);
            splunkInstance('doctor-profile').sendEvent({
              group: 'doctor profile',
              type: 'see center map',
              event: {
                data: {
                  doctor: {
                    full_name: information.display_name,
                    server_id: information.server_id,
                    slug: seo.slug,
                    id: information.id,
                    expertise: expertises.expertises[0].alias_title,
                    group_expertise: expertises.group_expertises[0].name,
                  },
                  center: {
                    center_status: center?.status,
                    center_type: center?.center_type,
                    center_name: center?.name,
                    city_en_slug: center?.city_en_slug,
                  },
                  user: {
                    terminal_id: getCookie('terminal_id'),
                  },
                },
              },
            });
          },
        };
      },
      children: (props: any) =>
        fragmentComponents?.addresses?.hide === false ? (
          <BookingGlobalContextsProvider>
            <Fragment
              name="Addresses"
              props={{
                centers: centers,
                slug: seo.slug,
              }}
            />
          </BookingGlobalContextsProvider>
        ) : (
          <CentersInfo className="bg-white md:rounded-lg" {...props} />
        ),
    },
  ];
};

