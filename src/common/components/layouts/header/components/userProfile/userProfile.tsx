import { useGetUserActiveTurnsCount } from '@/common/apis/services/booking/getUserActiveTurnsCount';
import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Divider from '@/common/components/atom/divider';
import { MenuItem, MenuList } from '@/common/components/atom/menu';
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
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
const Transition = dynamic(() => import('@/common/components/atom/transition'));

export const UserProfile = () => {
  const { openLoginModal } = useLoginModalContext();
  const { t } = useTranslation('common');
  const { isLogin, userInfo, pending } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
    pending: state.pending,
  }));
  const getUserActiveTurnsCount = useGetUserActiveTurnsCount();
  const setTurnsCount = useUserInfoStore(state => state.setTurnsCount);
  const turnsCount = useUserInfoStore(state => state.turnsCount);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  const menuItems = [
    {
      name: 'نوبت های من',
      icon: <CalenderIcon />,
      link: '/patient/appointments',
      badge: !!turnsCount.presence && (
        <Chips className="w-6 h-6 flex justify-center items-center !bg-red-500 !text-white">{turnsCount.presence}</Chips>
      ),
    },
    {
      name: 'لیست پزشکان من',
      icon: <BookmarkIcon />,
      link: '/patient/bookmarks',
    },
    {
      name: 'کاربران زیرمجموعه',
      icon: <UsersIcon />,
      link: '/patient/subuser',
    },
  ];

  useEffect(() => {
    open && handleGetTurnsCount();
  }, [open]);

  const handleLogin = () => {
    openLoginModal({
      state: true,
    });
  };

  const handleGetTurnsCount = async () => {
    const { data } = await getUserActiveTurnsCount.mutateAsync();
    setTurnsCount({
      ...data.result,
    });
  };

  return (
    <>
      {pending && <Skeleton w="8rem" h="2.5rem" rounded="md" />}
      {!pending &&
        (isLogin ? (
          <div ref={ref} className="relative flex items-center" onClick={() => setOpen(!open)}>
            <div className="flex items-center p-3 text-sm font-medium text-center cursor-pointer space-s-2 md:p-6 md:pl-4">
              <UserCircle width="30" height="30" />
              <Text className="hidden sm:block" fontWeight="bold">
                {userInfo?.name ?? ''} {userInfo?.family ?? ''}
              </Text>
              <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} />
            </div>
            <Transition
              match={open}
              animation="bottom"
              className="absolute left-0 z-50 max-w-xs min-w-full px-2 py-3 overflow-auto font-medium bg-white border shadow-md top-14 md:top-16 text-slate-700 whitespace-nowrap border-slate-200 rounded-2xl w-max md:ml-0"
            >
              <Link href="/patient/profile" prefetch={false}>
                <a>
                  <div className="flex items-center w-64 p-2 pb-3 space-s-3">
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
                              {userInfo?.name ?? ''} {userInfo?.family ?? ''}
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
              <Divider />
              <div className="flex flex-col p-3 pb-0 overflow-auto">
                <MenuList>
                  {menuItems.map(item => (
                    <MenuItem key={item.name} name={item.name} link={item.link} icon={item.icon}>
                      {item.badge}
                    </MenuItem>
                  ))}
                </MenuList>
                <Divider className="my-1" />
                <MenuList>
                  <MenuItem name="پشتیبانی" link="https://www.paziresh24.com/home/support-form/" icon={<HeadphoneIcon />} />
                  <MenuItem name="خروج" link="/logout" icon={<LogoutIcon />} />
                </MenuList>
              </div>
            </Transition>
          </div>
        ) : (
          <Button className="!px-4" size="sm" variant="secondary" onClick={handleLogin}>
            {t('header.userProfile.useNotloggedIn')}
          </Button>
        ))}
    </>
  );
};

export default UserProfile;
