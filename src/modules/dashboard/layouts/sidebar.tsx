import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Transition from '@/common/components/atom/transition';
import LogoutIcon from '@/common/components/icons/logout';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import range from 'lodash/range';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useApps } from '../apis/apps';
import { MenuItem } from '../components/menuItem';
import { defaultMenuData } from '../constants/defaultMenuData';

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
      router.push(`/login?redirect_url=${asPath}`);
    }
  }, [user, isUserPending]);

  const apps = appsData.data?.data;

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
                  <MenuItem key={menu.url} name={menu.label} icon={menu.icon} link={`${menu.url}/`} />
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
