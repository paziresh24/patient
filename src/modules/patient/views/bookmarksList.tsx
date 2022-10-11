import { useDeleteBookmark } from '@/common/apis/services/bookmarks/deleteBookmark';
import { useGetBookMarksList } from '@/common/apis/services/bookmarks/getBookmarksList';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import { DoctorParams } from '@/common/types/doctorParams';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import getConfig from 'next/config';
import Link from 'next/link';
import { useEffect } from 'react';
const { publicRuntimeConfig } = getConfig();

export const BookmarksList = () => {
  const { data, mutate, isSuccess, isLoading } = useGetBookMarksList();
  const deleteBookmark = useDeleteBookmark();
  useEffect(() => {
    mutate();
  }, []);

  const handleDeleteDoctorInBookmarkList = async (slug: string) => {
    await deleteBookmark.mutateAsync({
      slug,
    });
    mutate();
  };

  return (
    <div className="w-full grid md:grid-cols-2 gap-3 gap-y-4">
      {isLoading && <BookmarkListLoading />}
      {isSuccess && data?.data?.result.length === 0 && <Text className="text-slate-400">پزشک بوک مارک شده ای در لیست شما نیست.</Text>}
      {isSuccess &&
        data?.data?.result?.map((item: DoctorParams) => (
          <div key={item.id} className="border-b border-slate-100 pb-4 flex justify-between space-s-1 px-2">
            <Link href={item.doctor_url ?? '#'}>
              <a>
                <DoctorInfo
                  firstName={item.name}
                  lastName={item.family}
                  avatar={publicRuntimeConfig.CLINIC_BASE_URL + item.image}
                  expertise={getDisplayDoctorExpertise({
                    aliasTitle: item.expertises?.[0]?.alias_title ?? '',
                    degree: item.expertises?.[0]?.degree?.name ?? '',
                    expertise: item.expertises?.[0]?.expertise?.name ?? '',
                  })}
                />
              </a>
            </Link>
            <BookmarkIcon
              className="min-w-fit cursor-pointer"
              fill={true}
              onClick={() => handleDeleteDoctorInBookmarkList(item.slug ?? '#')}
            />
          </div>
        ))}
    </div>
  );
};

const BookmarkListLoading = () => {
  return (
    <>
      <Skeleton w="100%" h="6rem" rounded="lg" />
      <Skeleton w="100%" h="6rem" rounded="lg" />
      <Skeleton w="100%" h="6rem" rounded="lg" />
    </>
  );
};
