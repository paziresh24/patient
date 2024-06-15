import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import LocationIcon from '@/common/components/icons/location';
import PhoneIcon from '@/common/components/icons/phone';
import QuotesIcon from '@/common/components/icons/quotes';
import { Fragment } from '@/common/fragment';
import classNames from '@/common/utils/classNames';
import { openGoogleMap } from '@/common/utils/openGoogleMap';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactNode, memo } from 'react';
const Opener = dynamic(() => import('@/common/components/atom/opener/opener'));

interface CentersInfoProps {
  centers: {
    id: string;
    userCenterId: string;
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
  onEventPhoneNumber?: (centerId: string) => void;
  onEventAddress?: (centerId: string) => void;
}

export const CentersInfo = memo((props: CentersInfoProps) => {
  const { centers, className, onEventPhoneNumber, onEventAddress } = props;
  const showSchedules = useFeatureIsOn('booking:schedules-section');

  const DescriptionWrapper = ({ children, length }: { children: ReactNode; length: number }) => {
    if (length >= 140) {
      return (
        <Opener closeButtonText="بستن" openButtonText="ادامه" className="space-y-0 shadow-slate-50">
          {children}
        </Opener>
      );
    }
    return <div>{children}</div>;
  };

  return (
    <div className={classNames('p-3 flex flex-col space-y-2', className)}>
      {centers.map((center, index) => (
        <div key={index} className="flex flex-col p-4 space-y-3 rounded-lg bg-slate-50">
          {center.name && (
            <div className="flex justify-between">
              <Link href={center.slug} scroll prefetch={false}>
                <Text fontWeight="bold">{center.name}</Text>
              </Link>
            </div>
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
            <DescriptionWrapper length={center.description.length}>
              <div className="flex space-s-1">
                <QuotesIcon className="w-5 h-5 min-w-5" />
                <Text align="justify" fontSize="sm" className="leading-6">
                  {center.description}
                </Text>
              </div>
            </DescriptionWrapper>
          )}
          <div className="flex flex-col space-y-2">
            {showSchedules && (
              <Fragment
                name="Schedules"
                props={{
                  centerId: center.id,
                  userCenterId: center.userCenterId,
                  centerName: center.name,
                }}
              />
            )}
            {(center.location.lat || !isEmpty(center.phoneNumbers)) && (
              <>
                {typeof center.phoneNumbers === 'string' && (
                  <Button
                    variant="secondary"
                    icon={<PhoneIcon width={20} height={20} />}
                    onClick={() => {
                      onEventPhoneNumber?.(center.id);
                      location.href = `tel:${center.phoneNumbers}`;
                    }}
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
                      onClick={() => {
                        onEventPhoneNumber?.(center.id);
                        location.href = `tel:${phoneNumber}`;
                      }}
                    >
                      {phoneNumber}
                    </Button>
                  ))}
                {center.location.lat && (
                  <Button
                    variant="secondary"
                    icon={<LocationIcon width={20} height={20} />}
                    onClick={() => {
                      onEventAddress?.(center.id);
                      openGoogleMap(center.location);
                    }}
                  >
                    مشاهده در نقشه و مسیریابی
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default CentersInfo;
