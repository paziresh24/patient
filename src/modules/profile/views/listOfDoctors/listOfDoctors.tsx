import Autocomplete from '@/common/components/atom/autocomplete/autocomplete';
import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import SearchCard from '@/modules/search/components/card/card';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

type ExpertiseType = {
  lable: string;
  value: string;
};
interface ListOfDoctorsProps {
  doctors: any[];
  expertises: ExpertiseType[];
  onSearch: (query: string) => void;
  onSelectExpertise: (expertise: string) => void;
  loading?: boolean;
  showRateAndReviews?: boolean;
  defaultValue?: ExpertiseType;
  expertiseListLoading?: boolean;
}

export const ListOfDoctors = (props: ListOfDoctorsProps) => {
  const {
    doctors,
    expertises,
    onSearch,
    onSelectExpertise,
    defaultValue,
    loading = false,
    expertiseListLoading = false,
    showRateAndReviews = true,
  } = props;
  const [page, setPage] = useState(1);
  const router = useRouter();

  const sliceData = useMemo(() => doctors.slice(0, page * 5), [page, doctors]);

  return (
    <div className="flex flex-col space-y-3">
      {expertiseListLoading && (
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton h="3rem" className="!w-full md:!w-[68%]" rounded="lg" />
          <Skeleton h="3rem" className="!w-full md:!w-[32%]" rounded="lg" />
        </div>
      )}
      {!expertiseListLoading && (
        <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-s-2">
          <TextField
            placeholder="جستجوی نام پزشک ..."
            onChange={e => {
              onSearch(e.target.value);
              setPage(1);
            }}
          />
          <Autocomplete
            options={[{ label: 'همه تخصص ها', value: '' }, ...expertises]}
            onChange={e => {
              onSelectExpertise(e.target.value.value);
              setPage(1);
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
          sliceData.map(doctor => (
            <SearchCard
              key={doctor.title}
              type="doctor"
              baseInfo={{
                displayName: doctor.title,
                avatar: doctor.image,
                url: doctor.url,
                expertise: doctor.sub_title,
                ...(showRateAndReviews && {
                  rate: {
                    count: doctor.rates_count,
                    satisfaction: doctor.calculated_rate,
                  },
                }),
                viewCount: convertLongToCompactNumber(doctor.number_of_vist),
              }}
              details={{
                address: { text: doctor.display_address ?? '' },
                ...(doctor.available_time_text && {
                  badges: [
                    {
                      type: 'info',
                      title: `فعال شدن نوبت دهی اینترنتی ${doctor.available_time_text}`,
                    },
                  ],
                }),
              }}
              actions={[
                {
                  text: doctor.is_bulk ? 'مشاهده پروفایل' : 'دریافت نوبت',
                  ...(doctor.freeturn_text && !doctor.is_bulk && { description: `اولین نوبت: ${doctor.freeturn_text}` }),
                  action: () => {
                    router.push(doctor.url);
                  },
                  outline: doctor.is_bulk,
                },
              ]}
            />
          ))}
        {sliceData.length !== doctors.length && (
          <Button variant="secondary" onClick={() => setPage(prev => prev + 1)}>
            مشاهده بیشتر
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListOfDoctors;
