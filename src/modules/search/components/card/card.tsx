import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Card from '@/common/components/atom/card';
import Divider from '@/common/components/atom/divider';
import Text from '@/common/components/atom/text';
import DoctorIcon from '@/common/components/icons/doctor';
import EyeIcon from '@/common/components/icons/eye';
import LocationIcon from '@/common/components/icons/location';
import clsx from 'clsx';
import getConfig from 'next/config';
import Image from 'next/future/image';
import Link from 'next/link';
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
    url?: string;
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
}

export const SearchCard = (props: SearchCardProps) => {
  const { baseInfo, details, actions, type } = props;
  return (
    <Card className="relative">
      <Link href={baseInfo.url ?? '#'}>
        <a href="">
          <div className="flex items-center mb-3 space-s-2">
            <div className="relative">
              <Avatar
                src={publicRuntimeConfig.CLINIC_BASE_URL + baseInfo.avatar}
                width={80}
                height={80}
                className={clsx('border-2 border-slate-200', {
                  'border-primary': baseInfo.isVerify,
                })}
                as={Image}
              />
              {baseInfo.isVerify && (
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0 left-0 fill-primary"
                >
                  <path d="M11.4484 2.36564C12.0695 1.83327 12.3801 1.56708 12.75 1.56708C13.1199 1.56708 13.4305 1.83327 14.0516 2.36564L15.6883 3.76851C15.9661 4.00668 16.1051 4.12577 16.273 4.18789C16.4409 4.25 16.6239 4.25 16.9898 4.25H18.75C19.6928 4.25 20.1642 4.25 20.4571 4.54289C20.75 4.83579 20.75 5.30719 20.75 6.25V8.01015C20.75 8.37612 20.75 8.55911 20.8121 8.72702C20.8742 8.89493 20.9933 9.03387 21.2315 9.31173L22.6344 10.9484C23.1667 11.5695 23.4329 11.8801 23.4329 12.25C23.4329 12.6199 23.1667 12.9305 22.6344 13.5516L21.2315 15.1883C20.9933 15.4661 20.8742 15.6051 20.8121 15.773C20.75 15.9409 20.75 16.1239 20.75 16.4898V18.25C20.75 19.1928 20.75 19.6642 20.4571 19.9571C20.1642 20.25 19.6928 20.25 18.75 20.25H16.9898C16.6239 20.25 16.4409 20.25 16.273 20.3121C16.1051 20.3742 15.9661 20.4933 15.6883 20.7315L14.0516 22.1344C13.4305 22.6667 13.1199 22.9329 12.75 22.9329C12.3801 22.9329 12.0695 22.6667 11.4484 22.1344L9.81173 20.7315C9.53387 20.4933 9.39493 20.3742 9.22702 20.3121C9.05911 20.25 8.87612 20.25 8.51015 20.25H6.71578C5.77298 20.25 5.30157 20.25 5.00868 19.9571C4.71578 19.6642 4.71578 19.1928 4.71578 18.25V16.4834C4.71578 16.1206 4.71578 15.9391 4.65465 15.7724C4.59351 15.6057 4.47622 15.4673 4.24164 15.1905L2.84561 13.543C2.32236 12.9255 2.06074 12.6167 2.06074 12.25C2.06074 11.8833 2.32236 11.5745 2.84561 10.957L4.24164 9.30954C4.47622 9.03271 4.59351 8.8943 4.65465 8.72758C4.71578 8.56086 4.71578 8.37944 4.71578 8.01658V6.25C4.71578 5.30719 4.71578 4.83579 5.00868 4.54289C5.30157 4.25 5.77297 4.25 6.71578 4.25H8.51015C8.87612 4.25 9.05911 4.25 9.22702 4.18789C9.39493 4.12577 9.53387 4.00668 9.81173 3.76851L11.4484 2.36564Z" />
                  <path
                    d="M9.75018 12.25L11.7502 14.25L16.7502 9.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex flex-col w-full space-y-1">
              <div className="flex items-start justify-between">
                <Text fontWeight="bold" className="text-base md:text-lg">
                  {baseInfo.displayName ?? `${baseInfo.name} ${baseInfo.family}`}
                </Text>
                <div className="flex items-center space-s-1 absolute left-5 top-5">
                  <Text fontSize="sm">{baseInfo.viewCount}</Text>
                  <EyeIcon width={18} height={18} />
                </div>
              </div>
              {type === 'doctor' && (
                <Text fontSize="sm" className="line-clamp-2">
                  {baseInfo.expertise}
                </Text>
              )}
              {type === 'doctor' && (
                <div className="flex items-center !mt-2 space-s-2 text-sm md:text-base">
                  <div className="flex items-center space-s-1">
                    <svg width="23" height="23" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-primary">
                      <path
                        d="M12.795 2.51996L7.23969 8.86892C6.75029 9.42824 6.50559 9.7079 6.37779 10.048C6.25 10.3881 6.25 10.7597 6.25 11.5029V16C6.25 17.8856 6.25 18.8284 6.83579 19.4142C7.42157 20 8.36438 20 10.25 20H15.1948C16.6642 20 17.3988 20 17.9364 19.5894C18.474 19.1788 18.6673 18.47 19.0539 17.0525L19.8721 14.0525C20.5049 11.7322 20.8213 10.572 20.2209 9.78601C19.6206 9 18.418 9 16.013 9H13.25L15.3404 4.12239C15.771 3.11767 15.034 2 13.9409 2C13.5018 2 13.0842 2.18953 12.795 2.51996Z"
                        fillOpacity="0.16"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.3595 3.01384C13.5062 2.84617 13.7181 2.75 13.9409 2.75C14.4956 2.75 14.8695 3.31713 14.651 3.82695L12.5606 8.70456C12.4613 8.93628 12.4851 9.2024 12.6239 9.41287C12.7627 9.62334 12.9979 9.75 13.25 9.75H16.013C17.2393 9.75 18.0762 9.75189 18.6859 9.84046C19.2766 9.92628 19.4968 10.0735 19.6249 10.2413C19.753 10.409 19.8371 10.6602 19.7645 11.2526C19.6895 11.8641 19.4712 12.672 19.1485 13.8551L18.3303 16.8551C18.1323 17.5813 17.9997 18.0625 17.8563 18.4177C17.7203 18.7544 17.6037 18.8997 17.4812 18.9934C17.3586 19.087 17.1877 19.1613 16.8271 19.2039C16.4466 19.2488 15.9475 19.25 15.1948 19.25H10.25C9.28599 19.25 8.63843 19.2484 8.15539 19.1835C7.69393 19.1214 7.49643 19.0142 7.36612 18.8839C7.2358 18.7536 7.12858 18.5561 7.06654 18.0946C7.00159 17.6116 7 16.964 7 16V11.5029C7 10.7047 7.0111 10.4949 7.07987 10.3118C7.14865 10.1288 7.27847 9.96355 7.80413 9.3628L13.3595 3.01384ZM13.9409 1.25C13.2856 1.25 12.6621 1.53289 12.2306 2.02608L6.67526 8.37504L6.60306 8.45746C6.18398 8.93556 5.8525 9.31373 5.67572 9.78422C5.49894 10.2547 5.49938 10.7576 5.49994 11.3934L5.5 11.5029V16V16.052C5.49997 16.9505 5.49994 17.6997 5.57991 18.2945C5.66432 18.9223 5.84999 19.4891 6.30546 19.9445C6.76093 20.4 7.32773 20.5857 7.95552 20.6701C8.5503 20.7501 9.29952 20.75 10.198 20.75H10.25H15.1948H15.2382C15.9359 20.75 16.5242 20.75 17.003 20.6935C17.5115 20.6334 17.9767 20.5024 18.3916 20.1854C18.8066 19.8685 19.0554 19.4541 19.2472 18.9794C19.4277 18.5324 19.5825 17.9648 19.766 17.2917L19.7774 17.2498L20.5956 14.2498L20.6113 14.1922C20.9144 13.0811 21.1635 12.1677 21.2533 11.4351C21.347 10.671 21.2892 9.94904 20.8169 9.33077C20.3447 8.71249 19.6634 8.46673 18.9015 8.35604C18.1712 8.24994 17.2244 8.24997 16.0727 8.25H16.013H14.3874L16.0298 4.41783C16.6725 2.91821 15.5724 1.25 13.9409 1.25ZM4 10C4 9.58579 3.66421 9.25 3.25 9.25C2.83579 9.25 2.5 9.58579 2.5 10V20C2.5 20.4142 2.83579 20.75 3.25 20.75C3.66421 20.75 4 20.4142 4 20V10Z"
                      />
                    </svg>
                    <Text>
                      {baseInfo.rate?.satisfaction}٪ ({baseInfo.rate?.count} نظر)
                    </Text>
                  </div>
                  {baseInfo.experience && (
                    <>
                      <Divider orientation="vertical" height={20} />
                      <div className="flex items-center space-s-1">
                        <DoctorIcon width={23} height={23} />
                        <Text>{baseInfo.experience} سال تجربه </Text>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
      {details?.address?.text && (
        <div className="flex items-center mt-2 space-s-1">
          <LocationIcon className="w-5 h-5 min-w-[1.25rem]" />
          <Text fontSize="sm" className="line-clamp-1">
            {details?.address?.text}
          </Text>
        </div>
      )}
      {details?.price && (
        <div className="flex items-center mt-5 space-s-1">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 min-w-[1.25rem]"
          >
            <path
              d="M19.3 7.91998V13.07C19.3 16.15 17.54 17.47 14.9 17.47H6.10995C5.65995 17.47 5.22996 17.43 4.82996 17.34C4.57996 17.3 4.33996 17.23 4.11996 17.15C2.61996 16.59 1.70996 15.29 1.70996 13.07V7.91998C1.70996 4.83998 3.46995 3.52002 6.10995 3.52002H14.9C17.14 3.52002 18.75 4.47001 19.18 6.64001C19.25 7.04001 19.3 7.44998 19.3 7.91998Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.3011 10.9201V16.0701C22.3011 19.1501 20.5411 20.4701 17.9011 20.4701H9.11105C8.37105 20.4701 7.70106 20.3701 7.12106 20.1501C5.93106 19.7101 5.12105 18.8001 4.83105 17.3401C5.23105 17.4301 5.66105 17.4701 6.11105 17.4701H14.9011C17.5411 17.4701 19.3011 16.1501 19.3011 13.0701V7.9201C19.3011 7.4501 19.2611 7.03014 19.1811 6.64014C21.0811 7.04014 22.3011 8.38011 22.3011 10.9201Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.4984 13.1399C11.9564 13.1399 13.1384 11.9579 13.1384 10.4999C13.1384 9.04185 11.9564 7.85986 10.4984 7.85986C9.04038 7.85986 7.8584 9.04185 7.8584 10.4999C7.8584 11.9579 9.04038 13.1399 10.4984 13.1399Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.78003 8.30005V12.7001"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.2217 8.30029V12.7003"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Text fontSize="sm" className="line-clamp-1">
            {details?.price}
          </Text>
        </div>
      )}
      {details?.badges && details?.badges?.length > 0 && (
        <div className="flex flex-wrap justify-start gap-2 mt-5 md:justify-center">
          {details?.badges?.map((badge, index) => (
            <Badge key={index} {...badge} />
          ))}
        </div>
      )}
      <div className="flex items-end mt-6 space-s-3">
        {actions?.map((item, index) => (
          <div key={index} className="flex flex-col w-full space-y-3">
            <Text className="text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: item.description }} />
            <Button block variant={item.outline ? 'secondary' : 'primary'} onClick={item.action}>
              {item.text}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SearchCard;
