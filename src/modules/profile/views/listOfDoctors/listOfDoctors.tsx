import Autocomplete from '@/common/components/atom/autocomplete/autocomplete';
import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import { useRemovePrefixDoctorName } from '@/common/hooks/useRemovePrefixDoctorName';
import { splunkCenterProfileInstance } from '@/common/services/splunk';
import SearchCard from '@/modules/search/components/card/card';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useRef } from 'react';

type ExpertiseType = {
  lable: string;
  value: string;
};
interface ListOfDoctorsProps {
  doctors: any[];
  expertises: ExpertiseType[];
  onSearch: (query: string) => void;
  searchQuery: string;
  onSelectExpertise: (expertise: string) => void;
  loading?: boolean;
  showRateAndReviews?: boolean;
  defaultValue?: ExpertiseType;
  expertiseListLoading?: boolean;
  onChangePage: (page: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage?: boolean;
}

export const ListOfDoctors = (props: ListOfDoctorsProps) => {
  const {
    doctors,
    expertises,
    onSearch,
    searchQuery,
    onSelectExpertise,
    defaultValue,
    loading = false,
    expertiseListLoading = false,
    showRateAndReviews = true,
    onChangePage,
    hasNextPage,
    isFetchingNextPage,
  } = props;
  const page = useRef<number>(1);
  const router = useRouter();
  const removePrefixDoctorName = useRemovePrefixDoctorName();

  const handleClickEelmentEvent = (item: any, elementName: string, elementContent?: string) => {
    splunkCenterProfileInstance().sendEvent({
      group: 'center_profile',
      type: 'doctor_card_click',
      event: {
        element_name: elementName,
        element_content: elementContent,
        card_data: { ...item },
        terminal_id: getCookie('terminal_id'),
      },
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      {expertiseListLoading && (
        <div className="flex flex-col gap-3 md:flex-row">
          <Skeleton h="3rem" className="!w-full md:!w-[68%]" rounded="lg" />
          <Skeleton h="3rem" className="!w-full md:!w-[32%]" rounded="lg" />
        </div>
      )}
      {!expertiseListLoading && (
        <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-s-2">
          <TextField
            placeholder="جستجوی نام پزشک ..."
            value={searchQuery}
            onChange={e => {
              onSearch(e.target.value);
              page.current = 1;
              onChangePage(page.current);
            }}
          />
          <Autocomplete
            options={[{ label: 'همه تخصص ها', value: '' }, ...expertises]}
            onChange={e => {
              onSelectExpertise(e.target.value.value);
              page.current = 1;
              onChangePage(page.current);
            }}
            classNameWrapper="w-full md:max-w-[15rem] font-medium !text-sm"
            defaultValue={defaultValue}
            searchable
            placeholder="همه تخصص ها"
          />
        </div>
      )}
      <div className="flex flex-col space-y-2">
        {loading && (
          <>
            <Skeleton h="13rem" w="100%" rounded="lg" />
            <Skeleton h="13rem" w="100%" rounded="lg" />
            <Skeleton h="13rem" w="100%" rounded="lg" />
          </>
        )}
        {!loading && !doctors.length && (
          <div className="p-4 text-center rounded-lg bg-slate-200">
            <Text fontSize="sm" fontWeight="medium">
              پزشکی یافت نشد.
            </Text>
          </div>
        )}
        {!loading &&
          doctors.map(doctor => (
            <SearchCard
              key={doctor.title}
              type="doctor"
              baseInfo={{
                displayName: removePrefixDoctorName(doctor.title),
                avatar: doctor.image,
                url: doctor.url,
                expertise: doctor.display_expertise,
                isVerify: !doctor.is_bulk,
                ...(showRateAndReviews && {
                  rate: {
                    count: doctor.rates_count,
                    satisfaction: doctor.satisfaction,
                  },
                }),
                viewCount: doctor.view,
              }}
              details={{
                badges: doctor.badges,
              }}
              actions={doctor.actions
                .filter((action: any) => action.title !== 'ویزیت آنلاین')
                ?.map((action: any) => ({
                  text: action.title,
                  description: action.top_title,
                  outline: action.outline,
                  action: () => {
                    router.push(action.url);
                  },
                }))}
              sendEventWhenClick={({ element, content }) => handleClickEelmentEvent(doctor, element, content)}
            />
          ))}
        {hasNextPage && !loading && (
          <Button
            variant="secondary"
            onClick={() => {
              page.current += 1;
              return onChangePage(page.current);
            }}
            loading={isFetchingNextPage}
          >
            مشاهده بیشتر
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListOfDoctors;
