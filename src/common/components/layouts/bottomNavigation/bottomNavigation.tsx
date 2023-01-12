import { useGetUserActiveTurnsCount } from '@/common/apis/services/booking/getUserActiveTurnsCount';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import clsx from 'clsx';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import Text from '../../atom/text/text';
import CalenderIcon from '../../icons/calender';
import HomeIcon from '../../icons/home';
import SearchIcon from '../../icons/search';
import UserCircle from '../../icons/userCircle';

export const BottomNavigation = () => {
  const router = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const turnsCount = useUserInfoStore(state => state.turnsCount);
  const setTurnsCount = useUserInfoStore(state => state.setTurnsCount);
  const getUserActiveTurnsCount = useGetUserActiveTurnsCount();

  useEffect(() => {
    handleGetTurnsCount();
  }, [router.asPath]);

  const handleGetTurnsCount = async () => {
    const { data } = await getUserActiveTurnsCount.mutateAsync();
    setTurnsCount({
      ...data.result,
    });
  };

  const menus = [
    {
      name: 'خانه',
      icon: <HomeIcon />,
      link: '/',
      privateRoute: false,
    },
    {
      name: 'جستجو',
      icon: <SearchIcon />,
      link: '/s/',
      privateRoute: false,
    },
    {
      name: 'نوبت های من',
      icon: (
        <div className="relative">
          {!!turnsCount.presence && (
            <div className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -left-1">
              {turnsCount.presence}
            </div>
          )}
          <CalenderIcon />
        </div>
      ),
      link: '/patient/appointments/',
      privateRoute: true,
    },
    {
      name: 'پروفایل',
      icon: <UserCircle />,
      link: '/patient/',
      privateRoute: true,
    },
  ];

  const handleChangeRoute = (link: string, privateRoute: boolean) => {
    if (!isLogin && privateRoute) {
      handleOpenLoginModal({
        state: true,
        postLogin: () => router.push(link),
      });
      return;
    }
    router.push(link);
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-white border-t md:hidden border-slate-200">
      {menus.map(({ icon, name, link, privateRoute }, index) => (
        <div
          key={index}
          onClick={() => handleChangeRoute(link, privateRoute)}
          className={clsx('flex flex-col items-center space-y-1 w-[70px] font-medium text-slate-600', {
            '!text-primary font-bold': router.asPath.split('?')[0] === link,
          })}
        >
          {icon}
          <Text fontSize="xs">{name}</Text>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
