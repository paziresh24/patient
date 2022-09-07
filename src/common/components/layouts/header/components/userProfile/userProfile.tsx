import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import ChevronIcon from '@/common/components/icons/chevron';
import EditIcon from '@/common/components/icons/edit';
import HeadphoneIcon from '@/common/components/icons/headphone';
import LogoutIcon from '@/common/components/icons/logout';
import UserCircle from '@/common/components/icons/userCircle';
import UsersIcon from '@/common/components/icons/users';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

export const UserProfile = () => {
  const { openLoginModal } = useLoginModalContext();
  const { isLogin, userInfo, pending } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
    pending: state.pending,
  }));
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  const menuItems = [
    {
      id: 0,
      title: 'نوبت های من',
      link: '/patient/appointments',
      icon: <CalenderIcon />,
    },
    {
      id: 1,
      title: 'پشتیبانی',
      icon: <HeadphoneIcon />,
      link: 'https://www.paziresh24.com/home/support-form',
    },
    {
      id: 2,
      title: 'خروج',
      icon: <LogoutIcon />,
      link: 'https://www.paziresh24.com/logout',
    },
  ];

  const handleLogin = () => {
    openLoginModal({
      state: true,
    });
  };

  return (
    <>
      {pending && <Skeleton w="8rem" h="2.5rem" rounded="md" />}
      {!pending &&
        (isLogin ? (
          <div ref={ref} className="relative flex items-center" onClick={() => setOpen(!open)}>
            <div className="text-center cursor-pointer p-3 text-sm md:p-6 md:pl-4 font-medium flex items-center">
              <UserCircle width="30" height="30" className="ml-1" />
              <Text className="hidden sm:block" fontWeight="bold">
                {userInfo.name + ' ' + userInfo.family}
              </Text>
              <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} className="mr-2" />
            </div>
            {open && (
              <div className="absolute shadow-md left-[0] min-w-full text-slate-700 font-medium whitespace-nowrap z-50 py-3 px-2 overflow-auto bg-white border border-slate-300 rounded-2xl max-w-xs w-max  top-16 md:ml-0">
                <Link href="/patient/profile" prefetch={false}>
                  <a>
                    <div className="flex p-2 pb-3 items-center space-s-3 w-64">
                      <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo?.image ?? ''} width={50} height={50} />
                      <div className="flex flex-col space-y-2">
                        {!userInfo.name ? (
                          <>
                            <Skeleton h="1rem" w="8rem" rounded="full" />
                            <Skeleton h="1rem" rounded="full" />
                          </>
                        ) : (
                          <>
                            <div className="flex items-center">
                              <Text fontSize="sm" fontWeight="bold" className="line-clamp-1">
                                {userInfo.name} {userInfo.family}
                              </Text>
                              <EditIcon className="w-5 h-5" />
                            </div>
                            <Text fontSize="xs">{userInfo.username}</Text>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
                <hr className="border-slate-200" />
                <div className="flex overflow-auto flex-col p-3 pb-0">
                  <Link href="/patient/appointments" prefetch={false}>
                    <a className="py-3 flex items-center space-s-3 whitespace-nowrap">
                      <CalenderIcon />
                      <Text fontSize="sm" fontWeight="medium">
                        نوبت های من
                      </Text>
                    </a>
                  </Link>
                  <Link href="/patient/bookmarks" prefetch={false}>
                    <a className="py-3 flex items-center space-s-3 whitespace-nowrap">
                      <BookmarkIcon />
                      <Text fontSize="sm" fontWeight="medium">
                        لیست پزشکان من
                      </Text>
                    </a>
                  </Link>
                  <Link href="/patient/subuser" prefetch={false}>
                    <a className="py-3 flex items-center space-s-3 whitespace-nowrap">
                      <UsersIcon />
                      <Text fontSize="sm" fontWeight="medium">
                        کاربران زیرمجموعه
                      </Text>
                    </a>
                  </Link>
                  <hr className="border-slate-200 my-1" />
                  <Link href="https://www.paziresh24.com/home/support-form/">
                    <a className="py-3 flex items-center space-s-3 whitespace-nowrap">
                      <HeadphoneIcon />
                      <Text fontSize="sm" fontWeight="medium">
                        پشتیبانی
                      </Text>
                    </a>
                  </Link>
                  <Link href="/logout">
                    <a className="py-3 flex items-center space-s-3 whitespace-nowrap">
                      <LogoutIcon />
                      <Text fontSize="sm" fontWeight="medium">
                        خروج
                      </Text>
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button className="!px-4" size="sm" variant="secondary" onClick={handleLogin}>
            ورود / ثبت‌نام
          </Button>
        ))}
    </>
  );
};

export default UserProfile;
