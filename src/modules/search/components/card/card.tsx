import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Card from '@/common/components/atom/card';
import Divider from '@/common/components/atom/divider';
import Text from '@/common/components/atom/text';
import DoctorIcon from '@/common/components/icons/doctor';
import EyeIcon from '@/common/components/icons/eye';
import LikeIcon from '@/common/components/icons/like';
import LocationIcon from '@/common/components/icons/location';
import MoneyIcon from '@/common/components/icons/money';
import VerifyIcon from '@/common/components/icons/verify';
import clsx from 'clsx';
import getConfig from 'next/config';
import Image from 'next/future/image';
import Link from 'next/link';
import { useMemo } from 'react';
import Badge, { BadgeProps } from '../badge';
const { publicRuntimeConfig } = getConfig();

interface SearchCardProps {
  baseInfo: {
    displayName?: string;
    name?: string;
    family?: string;
    avatar?: string;
    expertise?: string;
    viewCount?: string;
    isVerify?: boolean;
    experience?: number;
    url: string;
    rate?: {
      satisfaction: number;
      count: number;
    };
  };
  type: 'center' | 'doctor';
  details?: {
    address?: {
      text: string;
    };
    price?: string;
    badges?: BadgeProps[];
  };
  actions?: {
    text: string;
    description: string;
    action: () => void;
    outline: boolean;
  }[];
  sendEventWhenClick?: () => void;
  avatarPriority?: boolean;
  className?: string;
}

export const SearchCard = (props: SearchCardProps) => {
  const { baseInfo, details, actions, type, sendEventWhenClick, avatarPriority, className } = props;

  const fullName = useMemo(() => baseInfo?.displayName ?? `${baseInfo?.name} ${baseInfo?.family}`, [baseInfo]);

  const imageAlt = useMemo(() => `${fullName} ${baseInfo?.expertise}`, [fullName, baseInfo.expertise]);

  const avatarLazyLoading: {
    priority: boolean;
    loading?: 'lazy';
  } = useMemo(
    () => ({
      priority: !!avatarPriority,
      ...(!avatarPriority && { loading: 'lazy' }),
    }),
    [avatarPriority],
  );

  return (
    <Card className={clsx('relative justify-between !p-3 md:!p-4', className)}>
      <div className="flex items-center mb-3 space-s-2">
        <Link href={baseInfo.url}>
          <a onClick={sendEventWhenClick}>
            <div className="relative">
              <Avatar
                src={publicRuntimeConfig.CLINIC_BASE_URL + baseInfo?.avatar}
                alt={imageAlt}
                width={80}
                height={80}
                className={clsx('border-2 border-slate-200', {
                  'border-primary': baseInfo?.isVerify,
                })}
                as={Image}
                {...avatarLazyLoading}
              />
              {baseInfo?.isVerify && <VerifyIcon className="absolute bottom-0 left-0 fill-primary" />}
            </div>
          </a>
        </Link>
        <div className="flex flex-col w-full space-y-1">
          <div className="flex items-start justify-between">
            <Link href={baseInfo.url}>
              <a className="w-4/5" onClick={sendEventWhenClick}>
                <Text as="h2" fontWeight="bold" className="text-base md:text-lg">
                  {baseInfo?.displayName ?? `${baseInfo?.name} ${baseInfo?.family}`}
                </Text>
              </a>
            </Link>
            {!!baseInfo?.viewCount && (
              <div className="absolute flex items-center space-s-1 rtl:left-5 ltr:right-5 top-5">
                <Text fontSize="xs">{baseInfo?.viewCount}</Text>
                <EyeIcon width={18} height={18} />
              </div>
            )}
          </div>
          {type === 'doctor' && (
            <Text fontSize="sm" className="line-clamp-2">
              {baseInfo?.expertise}
            </Text>
          )}
          {type === 'doctor' && (baseInfo?.rate?.count ?? 0) > 0 && (
            <div className="flex items-center !mt-2 space-s-2 text-sm md:text-base whitespace-nowrap">
              <div className="flex items-center space-s-1">
                <LikeIcon width={22} height={22} className="text-primary" />
                <Text fontWeight="medium" className="text-primary">
                  {baseInfo?.rate?.satisfaction}٪
                </Text>
                <Text>({baseInfo?.rate?.count} نظر)</Text>
              </div>
              {baseInfo?.experience && (
                <>
                  <Divider orientation="vertical" height={20} />
                  <div className="flex items-center space-s-1">
                    <DoctorIcon width={22} height={22} />
                    <Text>{baseInfo?.experience} سال تجربه </Text>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {details?.address?.text && (
        <div className="flex items-center mt-1 space-s-1">
          <LocationIcon className="w-5 h-5 min-w-[1.25rem]" />
          <Text fontSize="sm" className="line-clamp-1">
            {details?.address?.text}
          </Text>
        </div>
      )}
      {details?.price && (
        <div className="flex items-center mt-3 space-s-1">
          <MoneyIcon className="w-5 h-5 min-w-[1.25rem]" />
          <Text fontSize="sm" className="line-clamp-1">
            {details?.price}
          </Text>
        </div>
      )}
      {details?.badges && details?.badges?.length > 0 && (
        <div className="flex flex-wrap justify-start gap-2 mt-3 md:justify-center">
          {details?.badges?.map((badge, index) => (
            <Badge key={index} {...badge} />
          ))}
        </div>
      )}
      <div className="flex items-end mt-4 space-s-3">
        {actions?.map((item, index) => (
          <div key={index} className="flex flex-col w-full space-y-2">
            {item.description && <Text className="text-[0.7rem] md:text-sm" dangerouslySetInnerHTML={{ __html: item.description }} />}
            <Button
              block
              variant={item.outline ? 'secondary' : 'primary'}
              onClick={() => {
                item.action();
                sendEventWhenClick?.();
              }}
            >
              {item.text}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SearchCard;
