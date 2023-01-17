import { useDeleteBookmark } from '@/common/apis/services/bookmarks/deleteBookmark';
import { useGetBookMarksList } from '@/common/apis/services/bookmarks/getBookmarksList';
import DropDown from '@/common/components/atom/dropDown';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import ThreeDotsIcon from '@/common/components/icons/threeDots';
import TrashIcon from '@/common/components/icons/trash';
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
    <div className="grid w-full gap-3 md:grid-cols-2 gap-y-4">
      {isLoading && <BookmarkListLoading />}
      {isSuccess && data?.data?.result.length === 0 && <Text className="text-slate-400">پزشک ذخیره شده ای در لیست شما نیست.</Text>}
      {isSuccess &&
        data?.data?.result?.map((item: DoctorParams) => (
          <div key={item.id} className="relative flex flex-col items-end justify-between px-2 pb-4 border-b border-slate-100 space-s-1">
            <Link href={item.doctor_url ?? '#'}>
              <a className="w-full">
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
            <DropDown
              items={[
                {
                  id: 0,
                  name: 'حذف از لیست',
                  icon: <TrashIcon />,
                  action: () => handleDeleteDoctorInBookmarkList(item.slug ?? '#'),
                },
              ]}
              element={
                <div className="absolute top-0 flex items-center justify-center w-6 h-6 cursor-pointer" data-testid="turn-drop-down-button">
                  <ThreeDotsIcon className="w-4 h-4" />
                </div>
              }
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
