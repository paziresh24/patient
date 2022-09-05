import { useGetBookMarksList } from '@/common/apis/services/bookmarks/getBookmarksList';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import getConfig from 'next/config';
import { useEffect } from 'react';
const { publicRuntimeConfig } = getConfig();

export const BookmarksList = () => {
  const { data, mutate, isSuccess } = useGetBookMarksList();
  useEffect(() => {
    mutate();
  }, []);
  return (
    <div className="w-full grid md:grid-cols-2 gap-3">
      {isSuccess &&
        data?.data?.result?.map((item: DoctorInfo) => (
          <DoctorInfo
            key={item.id}
            firstName={item.name}
            lastName={item.family}
            avatar={publicRuntimeConfig.CLINIC_BASE_URL + item.image}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: item.expertises?.[0]?.alias_title ?? '',
              degree: item.expertises?.[0]?.degree?.name ?? '',
              expertise: item.expertises?.[0]?.expertise?.name ?? '',
            })}
          />
        ))}
    </div>
  );
};
