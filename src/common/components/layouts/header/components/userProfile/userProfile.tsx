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
import DiamondIcon from '@/common/components/icons/diamond';
import EditIcon from '@/common/components/icons/edit';
import ElementIcon from '@/common/components/icons/element';
import LogoutIcon from '@/common/components/icons/logout';
import UserCircle from '@/common/components/icons/userCircle';
import UsersIcon from '@/common/components/icons/users';
import useCustomize from '@/common/hooks/useCustomize';
import CreditDuration from '@/modules/bamdad/components/creditDuration';
import { useShowPremiumFeatures } from '@/modules/bamdad/hooks/useShowPremiumFeatures';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';
import useTranslation from 'next-translate/useTranslation';
import config from 'next/config';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
const Transition = dynamic(() => import('@/common/components/atom/transition'));
const { publicRuntimeConfig } = config();

export const UserProfile = () => {
  const router = useRouter();
  const { handleOpenLoginModal } = useLoginModalContext();
  const { t } = useTranslation('common');
  const { isLogin, userInfo, pending } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
    pending: state.pending,
  }));
  const logout = useUserInfoStore(state => state.logout);
  const getUserActiveTurnsCount = useGetUserActiveTurnsCount();
  const setTurnsCount = useUserInfoStore(state => state.setTurnsCount);
  const turnsCount = useUserInfoStore(state => state.turnsCount);
  const [open, setOpen] = useState(false);
  const { customize } = useCustomize();
  const isShowPremiumFeatures = useShowPremiumFeatures();
  const dashboardDoctorList = useFeatureValue('dashboard:doctor-list', { ids: [''] });
  const isShowDashboard = dashboardDoctorList.ids.includes(userInfo?.id?.toString() ?? '') || dashboardDoctorList.ids.includes('*');

  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  const menuItems = isShowDashboard
    ? [
        {
          name: 'داشبورد',
          icon: <ElementIcon />,
          link: '/dashboard',
          shouldShow: true,
        },
        {
          name: t('patient/common:menu.myTurns'),
          icon: <CalenderIcon />,
          link: '/dashboard/appointments',
          badge: !!turnsCount.presence && (
            <Chips className="w-6 h-6 flex justify-center items-center !bg-red-500 !text-white">{turnsCount.presence}</Chips>
          ),
          shouldShow: true,
        },
      ].filter(item => item.shouldShow)
    : [
        {
          name: t('patient/common:menu.myTurns'),
          icon: <CalenderIcon />,
          link: '/patient/appointments',
          badge: !!turnsCount.presence && (
            <Chips className="w-6 h-6 flex justify-center items-center !bg-red-500 !text-white">{turnsCount.presence}</Chips>
          ),
          shouldShow: true,
        },
        {
          name: t('patient/common:menu.bookmarks'),
          icon: <BookmarkIcon />,
          link: '/patient/bookmarks',
          shouldShow: customize.bookMark,
        },
        {
          name: t('patient/common:menu.subuser'),
          icon: <UsersIcon />,
          link: '/patient/subuser',
          shouldShow: true,
        },
      ].filter(item => item.shouldShow);

  useEffect(() => {
    open && handleGetTurnsCount();
  }, [open]);

  const handleLogin = () => {
    handleOpenLoginModal({
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
          <div ref={ref} className="relative flex flex-col items-end" onClick={() => setOpen(!open)}>
            <div className="flex items-center py-3 text-sm font-medium text-center cursor-pointer space-s-2 md:py-6 md:pl-4">
              <div className="relative">
                {userInfo?.image ? (
                  <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo?.image ?? ''} width={30} height={30} />
                ) : (
                  <UserCircle width="30" height="30" />
                )}
                {checkPremiumUser(userInfo.vip) && (
                  <div className="absolute bottom-0 right-0 flex items-center justify-center w-4 h-4 border border-white rounded-full bg-amber-400">
                    <DiamondIcon className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <Text className="hidden sm:block" fontWeight="bold">
                {userInfo?.name ?? ''} {userInfo?.family ?? ''}
              </Text>
              <ChevronIcon dir={`${open ? 'top' : 'bottom'}`} className="hidden md:block" />
            </div>
            <Transition
              match={open}
              animation="bottom"
              className="absolute max-w-xs min-w-full px-2 py-3 overflow-auto font-medium bg-white border shadow-md z-infinity top-14 md:top-16 text-slate-700 whitespace-nowrap border-slate-200 rounded-2xl w-max md:ml-0"
            >
              <Link href="/patient/profile" prefetch={false}>
                <div className="flex items-center w-64 p-2 pb-3 space-s-3">
                  <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo?.image ?? ''} width={50} height={50} />
                  <div className="flex flex-col space-y-2">
                    {pending ? (
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
                        <Text fontSize="xs">{userInfo.cell}</Text>
                      </>
                    )}
                  </div>
                </div>
              </Link>
              <Divider />
              <div className="flex flex-col px-0 py-0">
                {isShowPremiumFeatures && (
                  <>
                    <div className="px-3 py-4">
                      <CreditDuration />
                    </div>
                    <Divider />
                  </>
                )}
                <MenuList className="px-3">
                  {menuItems.map(item => (
                    <MenuItem key={item.name} name={item.name} link={item.link} icon={item.icon}>
                      {item.badge}
                    </MenuItem>
                  ))}
                </MenuList>
                <Divider className="my-1" />
                <MenuList className="px-3">
                  <MenuItem name={t('patient/common:menu.logout')} onClick={logout} icon={<LogoutIcon />} />
                </MenuList>
              </div>
            </Transition>
          </div>
        ) : (
          <Button className="!px-2 !text-xs md:!text-sm md:!px-4" size="sm" variant="secondary" onClick={handleLogin}>
            {t('common:header.userProfile.useNotloggedIn')}
          </Button>
        ))}
    </>
  );
};

export default UserProfile;
