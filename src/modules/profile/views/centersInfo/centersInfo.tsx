import Button from '@/common/components/atom/button/button';
import Opener from '@/common/components/atom/opener/opener';
import Text from '@/common/components/atom/text/text';
import LocationIcon from '@/common/components/icons/location';
import PhoneIcon from '@/common/components/icons/phone';
import QuotesIcon from '@/common/components/icons/quotes';
import { openGoogleMap } from '@/common/utils/openGoogleMap';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import Link from 'next/link';

interface CentersInfoProps {
  centers: {
    name?: string;
    phoneNumbers: string | string[];
    address: string;
    city: string;
    location: {
      lat: number;
      lon: number;
    };
    description?: string;
    slug: string;
  }[];
  className?: string;
}

export const CentersInfo = (props: CentersInfoProps) => {
  const { centers, className } = props;
  return (
    <div className={clsx('p-3 flex flex-col space-y-2', className)}>
      {centers.map((center, index) => (
        <div key={index} className="flex flex-col p-4 space-y-3 rounded-lg bg-slate-50">
          {center.name && (
            <Link href={center.slug} scroll>
              <a>
                <Text fontWeight="bold">{center.name}</Text>
              </a>
            </Link>
          )}
          {(center.address || center.city) && (
            <div className="!mt-1">
              {center.city && (
                <>
                  {' '}
                  <Text fontSize="sm" fontWeight="semiBold">
                    {center.city}
                  </Text>{' '}
                  -{' '}
                </>
              )}
              <Text fontSize="sm">{center.address}</Text>
            </div>
          )}
          {center.description && (
            <Opener closeButtonText="بستن" openButtonText="ادامه" className="space-y-0 shadow-slate-50">
              <div className="flex space-s-2">
                <QuotesIcon className="min-w-fit" width={18} height={18} />
                <Text align="justify" fontSize="sm">
                  {center.description}
                </Text>
              </div>
            </Opener>
          )}
          {(center.location.lat || !isEmpty(center.phoneNumbers)) && (
            <div className="flex flex-col space-y-2">
              {typeof center.phoneNumbers === 'string' && (
                <Button
                  variant="secondary"
                  icon={<PhoneIcon width={20} height={20} />}
                  onClick={() => (location.href = `tel:${center.phoneNumbers}`)}
                >
                  {center.phoneNumbers}
                </Button>
              )}
              {Array.isArray(center.phoneNumbers) &&
                center.phoneNumbers.map(phoneNumber => (
                  <Button
                    key={phoneNumber}
                    variant="secondary"
                    icon={<PhoneIcon width={20} height={20} />}
                    onClick={() => (location.href = `tel:${phoneNumber}`)}
                  >
                    {phoneNumber}
                  </Button>
                ))}
              {center.location.lat && (
                <Button variant="secondary" icon={<LocationIcon width={20} height={20} />} onClick={() => openGoogleMap(center.location)}>
                  مشاهده در نقشه و مسیریابی
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CentersInfo;
