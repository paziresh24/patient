import Avatar from '@/common/components/atom/avatar';
import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import EditIcon from '@/common/components/icons/edit';
import { UsersIcon } from '@/common/components/icons/users';
import useCustomize from '@/common/hooks/useCustomize';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { ReactElement } from 'react';

export const PatientProfileLayout = ({ children }: { children: ReactElement }) => {
  const userInfo = useUserInfoStore(state => state.info);
  const loginPending = useUserInfoStore(state => state.pending);
  const { customize } = useCustomize();

  const { t } = useTranslation('patient/common');

  return (
    <div className="max-w-screen-xl min-h-[70vh] md:grid md:grid-cols-12 mx-auto md:pt-10 md:space-s-8">
      <div className="hidden col-span-3 px-5 bg-white rounded-lg shadow-sm md:sticky md:top-10 h-fit md:pb-2 md:block">
        <Link href="/patient/profile">
          <div className="flex items-center p-5 px-0 space-s-5">
            <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo.image ?? ''} />
            <div className="flex flex-col space-y-2">
              {loginPending ? (
                <>
                  <Skeleton h="1rem" w="8rem" rounded="full" />
                  <Skeleton h="1rem" rounded="full" />
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <Text fontWeight="bold" className="line-clamp-1">
                      {userInfo.name ?? ''} {userInfo.family ?? ''}
                    </Text>
                    <EditIcon className="w-5 h-5" />
                  </div>
                  <Text fontSize="sm">{userInfo.username}</Text>
                </>
              )}
            </div>
          </div>
        </Link>
        <Divider />
        <div className="flex overflow-auto space-s-5 md:space-s-0 md:flex-col">
          <Link href="/patient/appointments" className="flex items-center py-4 space-s-3 whitespace-nowrap">
            <CalenderIcon />
            <Text fontWeight="medium">{t('menu.myTurns')}</Text>
          </Link>
          {customize.bookMark && (
            <Link href="/patient/bookmarks" className="flex items-center py-4 space-s-3 whitespace-nowrap">
              <BookmarkIcon />
              <Text fontWeight="medium">{t('menu.bookmarks')}</Text>
            </Link>
          )}
          <Link href="/patient/subuser" className="flex items-center py-4 space-s-3 whitespace-nowrap">
            <UsersIcon />
            <Text fontWeight="medium">{t('menu.subuser')}</Text>
          </Link>
        </div>
      </div>
      <div className="col-span-9 rounded-lg shadow-sm md:bg-white md:sticky md:top-10 md:p-8 h-fit">{children}</div>
    </div>
  );
};
