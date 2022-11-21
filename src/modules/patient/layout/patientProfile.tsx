import Avatar from '@/common/components/atom/avatar';
import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import EditIcon from '@/common/components/icons/edit';
import { UsersIcon } from '@/common/components/icons/users';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { ReactElement } from 'react';

export const PatientProfileLayout = ({ children }: { children: ReactElement }) => {
  const userInfo = useUserInfoStore(state => state.info);

  return (
    <div className="max-w-screen-xl min-h-[70vh] md:grid md:grid-cols-12 mx-auto md:mt-10 md:space-s-8">
      <div className="bg-white md:sticky md:top-10 col-span-3 h-fit md:pb-2 rounded-lg shadow-sm px-5 hidden md:block">
        <Link href="/patient/profile">
          <a>
            <div className="flex p-5 px-0 items-center space-s-5">
              <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo.image ?? ''} />
              <div className="flex flex-col space-y-2">
                {!userInfo.name ? (
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
          </a>
        </Link>
        <Divider />
        <div className="flex overflow-auto space-s-5 md:space-s-0 md:flex-col">
          <Link href="/patient/appointments">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap">
              <CalenderIcon />
              <Text fontWeight="medium">نوبت های من</Text>
            </a>
          </Link>
          <Link href="/patient/bookmarks">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap">
              <BookmarkIcon />
              <Text fontWeight="medium">لیست پزشکان من</Text>
            </a>
          </Link>
          <Link href="/patient/subuser">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap">
              <UsersIcon />
              <Text fontWeight="medium">کاربران زیرمجموعه</Text>
            </a>
          </Link>
        </div>
      </div>
      <div className="md:bg-white md:sticky md:top-10 col-span-9 md:p-8 rounded-lg shadow-sm h-fit">{children}</div>
    </div>
  );
};
