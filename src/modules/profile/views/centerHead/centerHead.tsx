import Avatar from '@/common/components/atom/avatar/avatar';
import Chips from '@/common/components/atom/chips/chips';
import Text from '@/common/components/atom/text/text';
import EyeIcon from '@/common/components/icons/eye';
import HospitalIcon from '@/common/components/icons/hospital';
import LocationIcon from '@/common/components/icons/location';
import UsersIcon from '@/common/components/icons/users';
import classNames from '@/common/utils/classNames';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import ToolBar, { ToolBarItems } from '@/modules/profile/components/head/toolBar';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ReactNode } from 'react';

interface CenterHeadProps {
  displayName: string;
  image: string;
  city?: string;
  province?: string;
  expertiseCount: number;
  activeDoctorsCount: number;
  pageViewCount?: number;
  serviceList?: string[];
  toolBarItems?: ToolBarItems;
  className?: string;
}

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) => (
  <div className="inline-flex min-w-[7.5rem] shrink-0 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
    <div className="flex flex-col">
      <Text fontSize="xs" className="text-slate-500">
        {label}
      </Text>
      <Text fontWeight="bold" fontSize="sm" className="text-slate-800">
        {value}
      </Text>
    </div>
  </div>
);

export const CenterHead = ({
  displayName,
  image,
  city,
  province,
  expertiseCount,
  activeDoctorsCount,
  pageViewCount,
  serviceList,
  toolBarItems,
  className,
}: CenterHeadProps) => {
  const locationLabel = [city, province].filter(Boolean).join('، ');

  return (
    <section className={classNames('overflow-hidden bg-white shadow-card md:rounded-2xl', className)}>
      <div className="relative bg-gradient-to-l from-primary/10 via-sky-50/80 to-white px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
        <div className="relative flex items-center justify-between gap-3">
          {toolBarItems && <ToolBar items={toolBarItems} />}
          {pageViewCount != null && pageViewCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              <EyeIcon width={18} height={18} />
              <Text fontSize="sm" fontWeight="medium">
                {convertLongToCompactNumber(pageViewCount)} بازدید
              </Text>
            </div>
          )}
        </div>

        <div className="relative mt-4 flex flex-col gap-4 md:flex-row md:items-start">
          <div className="mx-auto shrink-0 md:mx-0">
            <div className="rounded-full bg-gradient-to-br from-primary/15 via-white to-sky-50 p-1 shadow-lg ring-2 ring-white">
              <Avatar
                width={104}
                height={104}
                className="h-[104px] w-[104px] border-[3px] border-white shadow-md md:h-[120px] md:w-[120px]"
                src={image}
                alt={displayName}
                name={displayName}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center text-center md:items-start md:text-right">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <HospitalIcon width={16} height={16} />
              مرکز درمانی
            </span>

            <Text as="h1" fontSize="lg" fontWeight="bold" className="leading-8 text-slate-900 md:text-2xl md:leading-9">
              {displayName}
            </Text>

            {locationLabel && (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-600 md:justify-start">
                <LocationIcon width={16} height={16} className="shrink-0 text-primary" />
                <Text fontSize="sm">{locationLabel}</Text>
              </div>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <StatCard label="تخصص پزشکی" value={expertiseCount} icon={<HospitalIcon width={18} height={18} />} />
              <StatCard label="پزشک فعال" value={activeDoctorsCount} icon={<UsersIcon width={18} height={18} />} />
            </div>
          </div>
        </div>
      </div>

      {!!serviceList?.length && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 md:px-6">
          <Text fontSize="xs" fontWeight="semiBold" className="mb-3 text-slate-500">
            تخصص‌های این مرکز
          </Text>
          <ScrollContainer className="flex items-center gap-2 pb-0.5">
            {serviceList.map(service => (
              <Chips
                key={service}
                className="min-w-fit w-max whitespace-nowrap !rounded-full border border-primary/20 !bg-white !px-3.5 !py-1.5 !text-sm !text-slate-700 shadow-sm"
              >
                {service}
              </Chips>
            ))}
          </ScrollContainer>
        </div>
      )}
    </section>
  );
};

export default CenterHead;
