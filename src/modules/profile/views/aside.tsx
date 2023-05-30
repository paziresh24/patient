import Button from '@/common/components/atom/button/button';
import Card from '@/common/components/atom/card/card';
import Text from '@/common/components/atom/text/text';
import EditIcon from '@/common/components/icons/edit';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const CentersInfo = dynamic(() => import('./centersInfo'));
const Services = dynamic(() => import('./services'));
const BulkService = dynamic(() => import('./services/bulk'));

export const aside = ({ info, centers, isBulk, customize, editable, seo }: any) => [
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
  {
    isShow: isBulk,
    children: () => (
      <Card className="!rounded-none md:!rounded-lg">
        <Text fontWeight="bold" fontSize="sm">
          نوبت دهی این پزشک در پذیرش24 غیر فعال می باشد. شما میتوانید از پزشکان حاذق در این حوزه نوبت بگیرید.
        </Text>
      </Card>
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
