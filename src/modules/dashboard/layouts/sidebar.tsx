import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Transition from '@/common/components/atom/transition';
import BookmarksIcon from '@/common/components/icons/bookmarks';
import CalenderIcon from '@/common/components/icons/calender';
import EyeIcon from '@/common/components/icons/eye';
import LogoutIcon from '@/common/components/icons/logout';
import ShopIcon from '@/common/components/icons/shop';
import UserEditIcon from '@/common/components/icons/userEdit';
import UsersIcon from '@/common/components/icons/users';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useApps } from '../apis/apps';
import { MenuItem } from '../components/menuItem';

export type App = {
  key: string;
  name: string;
  icon?: string;
  source?: string;
  sub?: App[];
};

export const SideBar = ({ children, className, fullWidth }: { children: ReactNode; className?: string; fullWidth?: boolean }) => {
  const user = useUserInfoStore(state => state.info);
  const logout = useUserInfoStore(state => state.logout);
  const appsData = useApps(
    { user_id: user.id ?? '', phone_number: user.cell, is_doctor: user.provider?.job_title === 'doctor' },
    { enabled: !!user.id },
  );
  const isUserPending = useUserInfoStore(state => state.pending);
  const { asPath, ...router } = useRouter();

  useEffect(() => {
    if (!user.cell && !isUserPending) {
      router.replace(`/login?redirect_url=${asPath}`);
    }
  }, [user, isUserPending]);

  const apps = appsData.data?.data;

  const openProfileView = () => {
    window.open(`/dr/${user.provider?.slug}?@timestamp=${new Date().getTime()}`);
  };

  const defaultMenuData = [
    {
      icon: <UserEditIcon />,
      label: 'ویرایش پروفایل',
      url: '/dashboard/profile',
      ...(user.provider?.job_title === 'doctor' && {
        button: (
          <div
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              openProfileView();
            }}
            className="rounded-md p-1 hover:bg-slate-200/50 transition-colors"
          >
            <EyeIcon width={18} height={18} />
          </div>
        ),
      }),
      shouldShowDoctor: true,
    },
    {
      icon: <ShopIcon />,
      label: 'بازارچه',
      url: '/dashboard/bazaar',
      shouldShowDoctor: true,
    },
    {
      icon: <CalenderIcon />,
      label: 'نوبت های من',
      url: '/dashboard/appointments',
      shouldShowDoctor: true,
    },
    {
      icon: <BookmarksIcon />,
      label: 'لیست پزشکان من',
      url: '/dashboard/bookmarks',
      shouldShowDoctor: true,
    },
    {
      icon: <UsersIcon />,
      label: 'کاربران زیرمجموعه',
      url: '/dashboard/subuser',
      shouldShowDoctor: true,
    },
  ];

  return (
    <>
      <div className="flex flex-grow h-full overflow-hidden">
        <div
          className={classNames(
            'flex overflow-y-auto overflow-x-hidden no-scroll md:h-[calc(100vh-80px)] w-full flex-grow flex-col bg-white shadow-xl shadow-slate-400/20 z-20',
            className,
            { 'w-72 min-w-72 max-w-72': !fullWidth },
          )}
        >
          <Transition match={true} animation="left" className="h-full">
            <div className="flex flex-col justify-between h-full px-4 py-4">
              <div className="flex flex-col space-y-2">
                {(appsData.isLoading || appsData.isInitialLoading) && (
                  <div className="space-y-3">
                    {range(0, 3).map(_ => (
                      <Skeleton key={_} w="100%" className="opacity-50" h="2.75rem" rounded="md" />
                    ))}
                  </div>
                )}
                {appsData.isSuccess &&
                  apps
                    .filter((app: any) => app.pin)
                    .map((app: any) => (
                      <MenuItem
                        key={app.name}
                        name={app.name}
                        icon={app.icon}
                        pattern={app.key}
                        link={`/dashboard/apps/${app.key}/${
                          app.navigation_items.find((item: any, index: number) => item.rel === 'home' || index === 0)?.key
                        }/`}
                        subMenu={app.navigation_items
                          .filter((item: any, _: number, items: any[]) => (items.length === 1 ? item.rel !== 'home' : true))
                          .map((item: any) => ({
                            name: item.label,
                            link: `/dashboard/apps/${app.key}/${item.key}/`,
                          }))}
                      />
                    ))}
                {appsData.isSuccess && apps.some((app: any) => app.pin) && <Divider />}

                {appsData.isSuccess &&
                  apps
                    .filter((app: any) => !app.pin)
                    .map((app: any) => (
                      <MenuItem
                        key={app.name}
                        name={app.name}
                        icon={app.icon}
                        pattern={app.key}
                        link={`/dashboard/apps/${app.key}/${
                          app.navigation_items.find((item: any, index: number) => item.rel === 'home' || index === 0)?.key
                        }/`}
                        subMenu={app.navigation_items
                          .filter((item: any, _: number, items: any[]) => (items.length === 1 ? item.rel !== 'home' : true))
                          .map((item: any) => ({
                            name: item.label,
                            link: `/dashboard/apps/${app.key}/${item.key}/`,
                          }))}
                      />
                    ))}
                {((appsData.isSuccess && apps.some((app: any) => !app.pin)) || appsData.isLoading) && <Divider />}
                {defaultMenuData.map(menu => (
                  <MenuItem key={menu.url} name={menu.label} icon={menu.icon} button={menu?.button} link={`${menu.url}/`} />
                ))}
              </div>
              <div onClick={logout}>
                <MenuItem name="خروج" icon={<LogoutIcon />} />
              </div>
            </div>
          </Transition>
        </div>
        {children}
      </div>
    </>
  );
};
