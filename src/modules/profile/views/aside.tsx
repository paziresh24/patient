import Button from '@/common/components/atom/button/button';
import EditIcon from '@/common/components/icons/edit';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CentersInfo from './centersInfo';
import Services from './services';

const BulkService = dynamic(() => import('./services/bulk'));
const RecommendWrapper = dynamic(() => import('./recommend'));

export const aside = ({ information, centers, expertises, waitingTimeInfo, onlineVisit, isBulk, customize, editable, seo }: any) => [
  // Bulk
  {
    id: 'book-me',
    isShow: isBulk,
    children: () => <BulkService displayName={information.display_name} expertises={expertises} />,
  },
  // Services
  {
    id: 'book-me',
    isShow: !isBulk,
    function: () => {
      return {
        id: information.id,
        doctor: information,
        expertises,
        onlineVisit,
        centers,
        waitingTimeInfo,
        slug: seo.slug,
      };
    },
    children: (props: any) => <Services {...props} />,
  },
  // Rcommend
  {
    isShow: information?.should_recommend_other_doctors && centers[0] && expertises?.expertises?.[0],
    function: () => {
      return {
        doctorId: information.id,
        city: { name: centers[0].city, en_slug: information.city_en_slug },
        groupExpertise: expertises.group_expertises[0],
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
  // Centers Info
  {
    id: 'phone-and-address',
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
    children: (props: any) => <CentersInfo className="bg-white md:rounded-lg" {...props} />,
  },
];
