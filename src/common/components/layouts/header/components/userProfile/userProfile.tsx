import { useGetUserActiveTurnsCount } from '@/common/apis/services/booking/getUserActiveTurnsCount';
import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Divider from '@/common/components/atom/divider';
import { MenuItem, MenuList } from '@/common/components/atom/menu';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import ChevronIcon from '@/common/components/icons/chevron';
import EditIcon from '@/common/components/icons/edit';
import EyeIcon from '@/common/components/icons/eye';
import LogoutIcon from '@/common/components/icons/logout';
import ReceiptIcon from '@/common/components/icons/receipt';
import UserCircle from '@/common/components/icons/userCircle';
import UsersIcon from '@/common/components/icons/users';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
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
  const { handleOpen, handleClose, modalProps } = useModal();

  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  const menuItems = [
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
              {userInfo?.image ? (
                <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo?.image ?? ''} width={30} height={30} />
              ) : (
                <UserCircle width="30" height="30" />
              )}
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
                        <Text fontSize="xs">{userInfo.username}</Text>
                      </>
                    )}
                  </div>
                </div>
              </Link>
              <Divider />
              <div className="flex flex-col p-3 pb-0">
                <MenuList>
                  {menuItems.map(item => (
                    <MenuItem key={item.name} name={item.name} link={item.link} icon={item.icon}>
                      {item.badge}
                    </MenuItem>
                  ))}
                </MenuList>
                <Divider className="my-1" />
                <MenuList>
                  {/* {customize.showSupport && (
                    <MenuItem
                      name={t('patient/common:menu.support')}
                      link={`${publicRuntimeConfig.CLINIC_BASE_URL}/home/support-form/`}
                      icon={<HeadphoneIcon />}
                    />
                  )} */}
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

      <Modal {...modalProps} noHeader>
        <div className="flex flex-col items-center space-y-4">
          <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo?.image ?? ''} width={90} height={90} />
          <Text fontWeight="bold" align="center">
            دکتر {userInfo?.profile?.name} {userInfo?.profile?.family} خوش آمدید.
          </Text>
          <div className="flex flex-col w-full space-y-2">
            <Button
              icon={<ReceiptIcon />}
              variant="primary"
              onClick={() => {
                window.open(publicRuntimeConfig.DOCTOR_APP_BASE_URL);
                handleClose();
              }}
            >
              لیست مراجعین
            </Button>
            <Button
              icon={<EyeIcon />}
              block
              variant="secondary"
              onClick={() => {
                router.push(`/dr/${userInfo?.profile?.slug}`);
                handleClose();
              }}
            >
              مشاهده/ویرایش پروفایل عمومی
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserProfile;
