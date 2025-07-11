import { useGetUserActiveTurnsCount } from '@/common/apis/services/booking/getUserActiveTurnsCount';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import classNames from '@/common/utils/classNames';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useSearchStore } from '@/modules/search/store/search';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useMemo } from 'react';
import Text from '../../atom/text/text';
import CalenderIcon from '../../icons/calender';
import ElementIcon from '../../icons/element';
import HomeIcon from '../../icons/home';
import SearchIcon from '../../icons/search';
import UserCircle from '../../icons/userCircle';

export const BottomNavigation = () => {
  const router = useRouter();
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const turnsCount = useUserInfoStore(state => state.turnsCount);
  const setTurnsCount = useUserInfoStore(state => state.setTurnsCount);
  const getUserActiveTurnsCount = useGetUserActiveTurnsCount();
  const city = useSearchStore(state => state.city);
  const isApplication = useApplication();
  const customize = useCustomize(state => state.customize);

  const dashboardDoctorList = useFeatureValue('dashboard:doctor-list', { ids: [''] });
  const isEnabledDashboard = useFeatureIsOn('dashboard:enable');
  const isEnabledLauncher = useFeatureIsOn('launcher-flag');
  const isShowDashboard =
    !customize.partnerKey &&
    (isEnabledDashboard || dashboardDoctorList.ids.includes(user?.id?.toString() ?? '') || dashboardDoctorList.ids.includes('*'));

  const servicesMenu = useMemo(() => {
    if (!user?.id) {
      return {
        name: 'پروفایل',
        icon: <UserCircle />,
        fillIcon: <UserCircle />,
        link: '/patient',
        pattern: '/patient',
        privateRoute: false,
        exact: false,
      };
    }
    if (customize.partnerKey) {
      return {
        name: 'پروفایل',
        icon: <UserCircle />,
        fillIcon: <UserCircle />,
        link: '/patient',
        pattern: '/patient',
        privateRoute: false,
        exact: false,
      };
    }

    if (isEnabledLauncher && localStorage.getItem('use-dashboard') != user.id)
      return {
        name: 'خدمات',
        icon: <ElementIcon />,
        fillIcon: <ElementIcon isSolid />,
        link: '/_',
        pattern: '/_',
        privateRoute: true,
        exact: false,
      };
    if (
      isEnabledDashboard ||
      dashboardDoctorList.ids.includes(user?.id?.toString() ?? '') ||
      dashboardDoctorList.ids.includes('*') ||
      localStorage.getItem('use-dashboard') == user.id
    )
      return {
        name: 'داشبورد',
        icon: <ElementIcon />,
        fillIcon: <ElementIcon isSolid />,
        link: '/dashboard',
        pattern: '/dashboard',
        privateRoute: false,
        exact: false,
      };

    return {
      name: 'پروفایل',
      icon: <UserCircle />,
      fillIcon: <UserCircle />,
      link: '/patient',
      pattern: '/patient',
      privateRoute: false,
      exact: false,
    };
  }, [isShowDashboard, isEnabledLauncher, isEnabledDashboard, customize.partnerKey, user?.id]);

  useEffect(() => {
    isLogin && handleGetTurnsCount();
  }, [router.asPath, isLogin]);

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
      fillIcon: <HomeIcon isSolid />,
      link: isApplication ? '/apphome' : '/',
      pattern: isApplication ? '/apphome' : '/',
      privateRoute: false,
    },
    {
      name: 'جستجو',
      icon: <SearchIcon />,
      fillIcon: <SearchIcon />,
      link: `/s${city.en_slug !== 'ir' ? `/${city.en_slug}` : ''}`,
      pattern: '/s/[[...params]]',
      privateRoute: false,
    },
    user.provider?.job_title === 'doctor' && isShowDashboard
      ? {
          name: 'مراجعین من',
          icon: <CalenderIcon />,
          fillIcon: <CalenderIcon isSolid />,
          link: '/dashboard/apps/drapp/appointments/',
          exact: true,
          pattern: '',
          privateRoute: true,
        }
      : {
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
          fillIcon: <CalenderIcon isSolid />,
          link: isShowDashboard ? '/dashboard/appointments/' : '/patient/appointments',
          ...(isShowDashboard && { exact: true }),
          pattern: '/patient/appointments',
          privateRoute: true,
        },
    servicesMenu,
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
    <div className="fixed bottom-0 left-0 z-40 flex items-center justify-between w-full min-h-16 h-16 px-4 bg-[#F9F9F9] border-t print:hidden md:hidden border-[#d5d8db]">
      {menus.map(({ icon, fillIcon, name, link, privateRoute, pattern, exact }, index) => (
        <div
          key={index}
          onClick={() => handleChangeRoute(link, privateRoute)}
          className={classNames('flex flex-col items-center space-y-1 w-[70px] font-medium text-slate-700 transition-all scale-95', {
            '!text-primary font-bold scale-100': exact ? router.asPath === link : router.pathname === pattern,
          })}
        >
          {fillIcon && (exact ? router.asPath === link : router.pathname === pattern) ? fillIcon : icon}

          <Text fontSize="xs">{name}</Text>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
