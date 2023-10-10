import Divider from '@/common/components/atom/divider';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import Transition from '@/common/components/atom/transition';
import LogoutIcon from '@/common/components/icons/logout';
import ShopIcon from '@/common/components/icons/shop';
import WrenchIcon from '@/common/components/icons/wrench';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { range } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { useApps } from '../apis/apps';
import pluginIcon from '../assets/plugin.svg';
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
  const apps = useApps({ user_id: user.id ?? '', is_doctor: !!user.is_doctor }, { enabled: !!user.id });

  const isUserPending = useUserInfoStore(state => state.pending);
  const { asPath, ...router } = useRouter();

  useEffect(() => {
    if (!user.cell && !isUserPending) {
      router.push(`/login?redirect_url=${asPath}`);
    }
  }, [user, isUserPending]);

  const [activeTab, setActiveTab] = useState('tools');

  const tabs = [
    {
      key: 'tools',
      name: 'ابزرک‌ها',
      icon: <WrenchIcon className="w-5 h-5" />,
    },
    {
      key: 'store',
      name: 'بازارچه',
      icon: <ShopIcon className="w-5 h-5" />,
    },
  ];

  const data = apps.data?.data;

  return (
    <>
      <div className="flex h-full overflow-hidden flex-grow">
        <div
          className={classNames(
            'flex overflow-y-auto overflow-x-hidden no-scroll md:h-[calc(100vh-80px)] w-full flex-grow flex-col bg-white shadow-xl shadow-slate-400/20 z-20',
            className,
            { 'w-72 min-w-72 max-w-72': !fullWidth },
          )}
        >
          <div className="p-4">
            <div className="w-full p-2 space-s-2 flex bg-slate-100 rounded-lg">
              {tabs.map(tab => (
                <div
                  key={tab.key}
                  className={classNames(
                    'w-full flex items-center cursor-pointer justify-center space-s-1 p-2 text-center rounded-md text-slate-400',
                    {
                      'bg-white text-slate-800 shadow-sm': activeTab === tab.key,
                    },
                  )}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon}
                  <Text fontSize="sm" fontWeight="medium">
                    {tab.name}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <Transition match={activeTab === 'tools'} animation="left" className="h-full">
            <div className="flex flex-col justify-between h-full px-4 pb-4">
              <div>
                {(apps.isLoading || apps.isInitialLoading) && (
                  <div className="space-y-3">
                    {range(0, 3).map(_ => (
                      <Skeleton key={_} w="100%" className="opacity-50" h="2.75rem" rounded="md" />
                    ))}
                  </div>
                )}
                {apps.isSuccess &&
                  data?.map((menu: App[], index: number, menuItems: App[][]) => (
                    <Fragment key={index}>
                      {menu.map(app => (
                        <MenuItem
                          key={app.key}
                          name={app.name}
                          icon={app.icon}
                          link={`/dashboard/apps/${app.key}/`}
                          subMenu={app.sub?.map(item => ({ name: item.name, icon: item.icon, link: `/dashboard/apps/${item.key}/` }))}
                        />
                      ))}
                      {menuItems.length - 1 > index && <Divider className="my-3" />}
                    </Fragment>
                  ))}
              </div>
              <div onClick={logout}>
                <MenuItem name="خروج" icon={<LogoutIcon />} />
              </div>
            </div>
          </Transition>
          <Transition delay={400} match={activeTab === 'store'} animation="right" className="w-full flex flex-col h-full flex-grow">
            <div className="w-full space-y-5 pb-32 justify-center items-center flex flex-col h-full flex-grow">
              <img src={pluginIcon.src} alt="" />
              <Text fontSize="sm" fontWeight="medium">
                بزودی این بخش اضافه می شود.
              </Text>
            </div>
            <Link href="https://community.paziresh24.com/" className="py-4 bg-slate-200/50 shadow-inner cursor-pointer text-center">
              <Text fontSize="xs" fontWeight="medium" className="underline">
                توسعه دهنده/کارآفرین هستم
              </Text>
            </Link>
          </Transition>
        </div>
        {children}
      </div>
    </>
  );
};
