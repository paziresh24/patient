import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import EditIcon from '@/common/components/icons/edit';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CentersInfo from './centersInfo';
import Services from './services';

const BulkService = dynamic(() => import('./services/bulk'));
const Recommend = dynamic(() => import('@/modules/booking/components/recommend'));

export const aside = ({ info, centers, isBulk, customize, editable, handleViewAs, seo }: any) => [
  // Bulk
  {
    id: 'services_section',
    isShow: isBulk,
    children: () => <BulkService />,
  },
  // Services
  {
    id: 'services_section',
    isShow: !isBulk,
    function: () => {
      return {
        doctor: info,
        slug: seo.slug,
      };
    },
    children: (props: any) => <Services {...props} />,
  },
  // Rcommend
  {
    isShow: info?.should_recommend_other_doctors && centers[0] && info?.expertises?.[0],
    function: () => {
      return {
        doctorId: info.id,
        city: info.city_en_slug,
        category: info.expertises[0]?.expertise_groups[0].en_slug,
        clickRecommendEvent: (doctor: any) => {
          splunkInstance().sendEvent({
            group: 'recommend',
            type: 'clickrecommend',
            event: {
              data: {
                terminal_id: getCookie('terminal'),
                user_agent: window.navigator.userAgent,
                page_url: window.location.pathname,
                referrer: document.referrer,
                group_expertises: info.group_expertises?.[0]?.name ?? 'سایر',
                doctor_name: info.display_name,
                server_id: info.server_id,
                recommendations: doctor,
              },
            },
          });
        },
      };
    },
    children: (props: any) => (
      <div className="flex flex-col space-y-3 md:hidden">
        <Text fontWeight="bold" className="px-4 leading-6 md:px-0 line-clamp-1">
          برترین پزشکان {info.expertises[0].expertise_groups[0].name} {centers[0].city ? `در ${centers[0].city}` : null}{' '}
          <Text fontWeight="medium" fontSize="sm">
            از دیدگاه بیماران
          </Text>
        </Text>
        <Recommend className="pr-4 md:pr-0" {...props} />
      </div>
    ),
  },
  // Centers Info
  {
    id: 'center-info_section',
    title: 'آدرس و تلفن تماس',
    isShow: centers.some((center: any) => center.id !== CENTERS.CONSULT),
    ActionButton: customize.showContribute && !editable && (
      <Link href={`/patient/contribute/?slug=${seo.slug}&test_src=profile_eslah`} prefetch={false}>
        <Button variant="text" size="sm" className="flex text-xs font-semibold h-9 gap-x-1 text-primary">
          <EditIcon width={17} height={17} />
          گزارش تلفن و آدرس صحیح
        </Button>
      </Link>
    ),
    function: () => {
      return {
        centers: centers
          .filter((center: any) => center.id !== CENTERS.CONSULT)
          .map((center: any) => ({
            id: center.id,
            address: center.address,
            city: center.city,
            slug: center.center_type === 1 ? `/dr/${seo.slug}` : `/center/${center.slug}`,
            description: center.description,
            phoneNumbers: center?.display_number_array,
            name: center.center_type !== 1 ? center.name : `مطب ${info?.display_name}`,
            location: center.map,
          })),
        onEventPhoneNumber: (centerId: any) => {
          const center = info.centers.find((center: any) => center.id === centerId);
          splunkInstance().sendEvent({
            group: 'doctor profile',
            type: 'see center phone',
            event: {
              data: {
                doctor: {
                  name: info.name,
                  family: info.family,
                  server_id: info.server_id,
                  slug: seo.slug,
                  id: info.id,
                  expertise: info.expertises[0].expertise.name,
                  group_expertise: info.group_expertises[0].name,
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
          splunkInstance().sendEvent({
            group: 'doctor profile',
            type: 'see center map',
            event: {
              data: {
                doctor: {
                  name: info.name,
                  family: info.family,
                  server_id: info.server_id,
                  slug: seo.slug,
                  id: info.id,
                  expertise: info.expertises[0].expertise.name,
                  group_expertise: info.group_expertises[0].name,
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
    children: (props: any) => <CentersInfo className="bg-white md:rounded-lg" {...props} />,
  },
];
