import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Transition from '@/common/components/atom/transition';
import BookmarksIcon from '@/common/components/icons/bookmarks';
import CalenderIcon from '@/common/components/icons/calender';
import CommentIcon from '@/common/components/icons/comment';
import EyeIcon from '@/common/components/icons/eye';
import LogoutIcon from '@/common/components/icons/logout';
import ShopIcon from '@/common/components/icons/shop';
import UserEditIcon from '@/common/components/icons/userEdit';
import UsersIcon from '@/common/components/icons/users';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useQueryClient } from '@tanstack/react-query';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  const appsData = useApps();
  const isUserPending = useUserInfoStore(state => state.pending);
  const { asPath, ...router } = useRouter();
  const shouldShowBazaarMenu = useFeatureIsOn('dashboard:bazaar-menu|enable');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user.cell && !isUserPending) {
      router.replace(`/login?redirect_url=${asPath}`);
    }
    if (user.id) {
      splunkInstance('dashboard').sendEvent({
        group: 'dashboard',
        type: 'dashboard_page_load',
        event: {
          data: {
            user_id: user.id,
            job_title: user.provider?.job_title ?? 'normal',
          },
        },
      });
    }
  }, [user, isUserPending]);

  const apps = appsData.data?.data;

  const openProfileView = () => {
    window.open(`/dr/${user.provider?.slug}?@timestamp=${new Date().getTime()}`);
  };

  const currentData: any = useMemo(
    () =>
      queryClient.getQueryData([
        'app',
        { user_id: user.id ?? '', phone_number: user.cell, is_doctor: user.provider?.job_title === 'doctor' },
      ]),
    [appsData?.data],
  );

  useEffect(() => {
    window.addEventListener('message', function (event) {
      if (event.data.state === 'installed') {
        toast.remove('install-app-toast');
        const updatedData = {
          ...currentData,
          data: [...(currentData?.data ?? []), { ...event.data.manifest, installation_id: event.data?.installation_id, pin: true }],
        };
        queryClient.setQueryData(
          ['app', { user_id: user.id ?? '', phone_number: user.cell, is_doctor: user.provider?.job_title === 'doctor' }],
          updatedData,
        );
        // toast.success('hi');
        toast.custom(
          t => (
            <div className="flex w-full max-w-md bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
              <div className="flex-1 w-0 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 pt-0.5">
                    <img className="h-10 w-10 min-w-[2.5rem] rounded-full" src={event.data?.item?.logo?.src} alt="" />
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-slate-900">اَبزارک {event.data?.item.name} نصب شد.</p>
                    {/* <p className="mt-1 text-sm text-gray-500">Sure! 8:30pm works great!</p> */}
                  </div>
                </div>
              </div>
              <div className="flex border-r border-slate-200">
                <button
                  onClick={() => {
                    router.push(`/dashboard/apps/${event.data?.manifest?.key}/${event.data?.manifest?.navigation_items[0]?.key}/`);
                    toast.dismiss(t.id);
                  }}
                  className="flex items-center justify-center w-full p-4 text-sm font-medium border border-transparent rounded-none rounded-l-lg text-primary hover:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  مشاهده
                </button>
              </div>
            </div>
          ),
          {
            id: 'install-app-toast',
            position: 'top-center',
            duration: 5000,
          },
        );
      }
      if (event.data.state === 'uninstalled') {
        const updatedData = {
          ...currentData,
          data: (currentData?.data ?? [])?.filter((_item: any) => _item.installation_id !== event.data.installation_id),
        };
        queryClient.setQueryData(
          ['app', { user_id: user.id ?? '', phone_number: user.cell, is_doctor: user.provider?.job_title === 'doctor' }],
          updatedData,
        );
      }
    });
  }, [currentData]);

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
            className="p-1 transition-colors rounded-md hover:bg-slate-200/50"
          >
            <EyeIcon width={18} height={18} />
          </div>
        ),
      }),
      shouldShowDoctor: true,
      shouldShow: true,
    },
    {
      icon: <CalenderIcon />,
      label: 'نوبت های من',
      url: '/dashboard/appointments',
      shouldShowDoctor: true,
      shouldShow: true,
    },
    {
      icon: <CommentIcon />,
      label: 'نظرات من',
      url: '/dashboard/reviews',
      shouldShowDoctor: true,
      shouldShow: true,
    },
    {
      icon: <BookmarksIcon />,
      label: 'لیست پزشکان من',
      url: '/dashboard/bookmarks',
      shouldShowDoctor: true,
      shouldShow: true,
    },
    {
      icon: <UsersIcon />,
      label: 'کاربران زیرمجموعه',
      url: '/dashboard/subuser',
      shouldShowDoctor: true,
      shouldShow: true,
    },
  ].filter(item => item.shouldShow);

  const appClickEvent = ({ menu_name, app_key, app_manifest }: { menu_name: string; app_key: string; app_manifest?: string }) => {
    splunkInstance('dashboard').sendEvent({
      group: 'dashboard',
      type: 'dashboard_page_load',
      event: {
        data: {
          user_id: user.id,
          job_title: user.provider?.job_title ?? 'normal',
          menu_name,
          app_key,
          app_manifest,
        },
      },
    });
  };

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
                {appsData.isSuccess &&
                  apps
                    .filter((app: any) => !app.pin)
                    .map((app: any) => (
                      <MenuItem
                        key={app.key}
                        name={app.display_name.fa}
                        icon={app.icon}
                        pattern={app.key}
                        link={`/dashboard/apps/${app.key}/${
                          app.fragments
                            .find((item: any) => item.type === 'menu')
                            ?.options?.find((item: any, index: number) => item.rel === 'home' || index === 0)?.key
                        }/`}
                        subMenu={app.fragments
                          .find((item: any) => item.type === 'menu')
                          ?.options?.filter((item: any, _: number, items: any[]) => (items.length === 1 ? false : true))
                          .map((item: any) => ({
                            name: item.name?.fa,
                            link: `/dashboard/apps/${app.key}/${item.key}/`,
                          }))}
                        onEvent={label =>
                          appClickEvent({
                            app_key: app.key,
                            menu_name: label,
                            app_manifest: app.manifest,
                          })
                        }
                      />
                    ))}

                {((appsData.isSuccess && (apps.some((app: any) => !app.pin) || shouldShowBazaarMenu)) ||
                  (user.provider?.job_title === 'doctor' || shouldShowBazaarMenu ? appsData.isLoading : false)) && <Divider />}
                {defaultMenuData.map(menu => (
                  <MenuItem
                    key={menu.url}
                    name={menu.label}
                    icon={menu.icon}
                    button={menu?.button}
                    link={`${menu.url}/`}
                    onEvent={label =>
                      appClickEvent({
                        app_key: 'default_app',
                        menu_name: label,
                      })
                    }
                  />
                ))}
                {((appsData.isSuccess && apps.some((app: any) => app.pin)) || appsData.isLoading || appsData.isInitialLoading) && (
                  <Divider />
                )}
                {(appsData.isLoading || appsData.isInitialLoading) && (
                  <div className="space-y-3">
                    {range(0, 3).map(_ => (
                      <Skeleton key={_} w="100%" className="opacity-50" h="2.75rem" rounded="md" />
                    ))}
                  </div>
                )}
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
