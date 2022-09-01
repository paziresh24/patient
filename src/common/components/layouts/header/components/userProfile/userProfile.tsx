import Button from '@/common/components/atom/button';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import Calender from '@/common/components/icons/calender';
import Headphone from '@/common/components/icons/headphone';
import Logout from '@/common/components/icons/logout';
import UserCircle from '@/common/components/icons/userCircle';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import SubMenu from '../subMenu';

export const UserProfile = () => {
  const { openLoginModal } = useLoginModalContext();
  const { isLogin, userInfo, pending } = useUserInfoStore(state => ({
    isLogin: state.isLogin,
    userInfo: state.info,
    pending: state.pending,
  }));

  const menuItems = [
    {
      id: 0,
      title: 'نوبت های من',
      link: '/appointments',
      icon: <Calender />,
    },
    {
      id: 1,
      title: 'پشتیبانی',
      icon: <Headphone />,
      link: 'https://www.paziresh24.com/home/support-form',
    },
    {
      id: 2,
      title: 'خروج',
      icon: <Logout />,
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
          <SubMenu
            title={
              <>
                <UserCircle width="30" height="30" />
                <Text className="hidden sm:block" fontWeight="bold">
                  {userInfo.name + ' ' + userInfo.family}
                </Text>
              </>
            }
            menuItem={menuItems}
            hasIcon
          />
        ) : (
          <Button className="!px-4" size="sm" variant="secondary" onClick={handleLogin}>
            ورود / ثبت‌نام
          </Button>
        ))}
    </>
  );
};

export default UserProfile;
