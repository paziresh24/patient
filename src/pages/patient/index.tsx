import Head from 'next/head';

import Avatar from '@/common/components/atom/avatar';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import EditIcon from '@/common/components/icons/edit';
import UsersIcon from '@/common/components/icons/users';
import AppBar from '@/common/components/layouts/appBar';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { useEffect } from 'react';
import { NextPageWithLayout } from '../_app';

export const PatinetProfile: NextPageWithLayout = () => {
  const userInfo = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { openLoginModal } = useLoginModalContext();
  const userInfoPending = useUserInfoStore(state => state.pending);

  useEffect(() => {
    !isLogin &&
      openLoginModal({
        state: true,
      });
  }, [isLogin]);

  return (
    <>
      <Head>
        <title>ویرایش اطلاعات من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <AppBar title="پروفایل من" />

      <div className="h-screen">
        <Link href="/patient/profile?referrer=profile&isWebView=1">
          <a>
            <div className="flex p-5 items-center space-s-5 bg-white shadow-sm border-t border-slate-200">
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
                        {userInfo.name} {userInfo.family}
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
        <div className="flex flex-col mt-2 space-y-1">
          <Link href="/patient/appointments?referrer=profile&isWebView=1">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap bg-white px-5 shadow-sm">
              <CalenderIcon />
              <Text fontWeight="medium">نوبت های من</Text>
            </a>
          </Link>
          <Link href="/patient/bookmarks?referrer=profile&isWebView=1">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap bg-white px-5 shadow-sm">
              <BookmarkIcon />
              <Text fontWeight="medium">لیست پزشکان من</Text>
            </a>
          </Link>
          <Link href="/patient/subuser?referrer=profile&isWebView=1">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap bg-white px-5 shadow-sm">
              <UsersIcon />
              <Text fontWeight="medium">کاربران زیرمجموعه</Text>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default PatinetProfile;
