import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement, useEffect } from 'react';
import LauncherApps from '.plasmic/LauncherApps';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';
import AppBar from '@/common/components/layouts/appBar';
import Seo from '@/common/components/layouts/seo';
import { useGetMyApps } from '@/modules/hamdast/apis/myapps';
import Divider from '@/common/components/atom/divider';
import Button from '@/common/components/atom/button';
import AppCard from '@/modules/hamdast/appCard';
import { useGetNotifications } from '@/modules/hamdast/apis/notifications';
import Transition from '@/common/components/atom/transition';
import { useRouter } from 'next/router';
import Loading from '@/common/components/atom/loading';
import ToolCaseIcon from '@/common/components/icons/toolCase';
import { splunkInstance } from '@/common/services/splunk';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

const Page = () => {
  const { data: profile_addons, isLoading: profile_addons_is_loading } = useGetMyApps({ type: 'profile_addons' });
  const { data: addons, isLoading: addons_is_loading } = useGetMyApps({ type: 'addons' });
  const { data: requests, isLoading: requests_is_loading } = useGetMyApps({ type: 'requests' });
  const { data: deactive_addons, isLoading: deactive_addons_is_loading } = useGetMyApps({ type: 'deactive_addons' });
  const { data: notifications } = useGetNotifications();
  const router = useRouter();
  const { info: user } = useUserInfoStore();

  const isLoading = profile_addons_is_loading || addons_is_loading || requests_is_loading || deactive_addons_is_loading;
  const showEmptyState = !isLoading && [profile_addons?.data, addons?.data, requests?.data, deactive_addons?.data].every(item => item == 0);

  const myAppSendEvent = (action: string, metaData?: Record<string, any>) => {
    splunkInstance('dashboard').sendEvent({
      group: 'myapps',
      type: action,
      event: {
        user_id: user?.id,
        notifications: notifications?.data?.items?.length,
        profile_addons: profile_addons?.data?.length,
        addons: addons?.data?.length,
        requests: requests?.data?.length,
        deactive_addons: deactive_addons?.data?.length,
        ...metaData,
      },
    });
  };

  useEffect(() => {
    if (!isLoading) {
      myAppSendEvent('load_page');
    }
  }, [isLoading]);

  return (
    <>
      <Seo title="ابزارک‌های من" noIndex />
      <AppBar title="ابزارک‌های من" backButton={true} />

      <div className="flex flex-grow flex-col gap-3 p-4">
        {showEmptyState && (
          <div className="flex justify-center items-center flex-col flex-grow gap-4">
            <div className="relative">
              <Transition match animation="bottom">
                <img
                  src="https://hamdast.s3.ir-thr-at1.arvanstorage.ir/apps%2Fbimehnama.png?versionId="
                  alt=""
                  className="w-9 h-9 rounded-full border border-slate-100 absolute right-0 top-3 shadow-xl"
                />
                <img
                  src="https://hamdast.s3.ir-thr-at1.arvanstorage.ir/apps%2Fcywoc24.png?versionId="
                  alt=""
                  className="w-9 h-9 rounded-full border border-slate-100 absolute left-3 top-4 shadow-xl"
                />
                <img
                  src="https://hamdast.s3.ir-thr-at1.arvanstorage.ir/apps%2Fcheragh.png?versionId="
                  alt=""
                  className="w-9 h-9 rounded-full border border-slate-100 absolute left-14 top-0 shadow-xl"
                />
                <img
                  src="https://hamdast.s3.ir-thr-at1.arvanstorage.ir/apps%2Fnotification.png?versionId="
                  alt=""
                  className="w-9 h-9 rounded-full border border-slate-100 absolute right-10 top-10 shadow-xl"
                />
              </Transition>
              <img src="https://launcher.s3.ir-thr-at1.arvanstorage.ir/empty-state.png?versionId=" className="w-36 h-36" />
            </div>
            <span className="font-bold text-sm">هنوز ابزارکی را فعال نکردید</span>
            <Button
              size="sm"
              className="px-7"
              onClick={() => {
                router.push('/_/apps');
                myAppSendEvent('open_apps_list_empty_state');
              }}
              icon={<ToolCaseIcon />}
            >
              مشاهده جعبه ابزار
            </Button>
            <span className="text-xs opacity-60">+۳هزار پزشک از ابزارک‌ها استفاده می‌کنند.</span>
          </div>
        )}
        {isLoading && (
          <div className="flex-grow flex justify-center items-center">
            <Loading />
          </div>
        )}
        {!isLoading && (
          <>
            {profile_addons?.data?.length > 0 && (
              <div className="flex flex-col gap-2  bg-slate-50 rounded-xl p-4">
                <span className="text-sm font-bold text-primary">ابزارک‌های فعال شده در پروفایل</span>
                <div className="flex flex-col gap-1">
                  {profile_addons?.data?.map?.((item: any, index: number) => (
                    <>
                      <AppCard
                        item={item}
                        notifications={notifications?.data?.items?.filter?.((notification: any) => notification.sender == item.app_key)}
                        myAppSendEvent={myAppSendEvent}
                      />
                      {index !== profile_addons?.data?.length - 1 && <Divider className="bg-slate-200" />}
                    </>
                  ))}
                </div>
              </div>
            )}
            {addons?.data?.length > 0 && (
              <div className="flex flex-col gap-2  bg-slate-50 rounded-xl p-4">
                <span className="text-sm font-bold text-primary">دیگر امکانات فعال شده</span>
                <div className="flex flex-col gap-1">
                  {addons?.data?.map?.((item: any, index: number) => (
                    <>
                      <AppCard
                        item={item}
                        notifications={notifications?.data?.items?.filter?.((notification: any) => notification.sender == item.app_key)}
                        myAppSendEvent={myAppSendEvent}
                      />
                      {index !== addons?.data?.length - 1 && <Divider className="bg-slate-200" />}
                    </>
                  ))}
                </div>
              </div>
            )}
            {requests?.data?.length > 0 && (
              <div className="flex flex-col gap-2  bg-slate-50 rounded-xl p-4">
                <span className="text-sm font-bold text-primary">اخیرا استفاده شده</span>
                <div className="flex flex-col gap-1">
                  {requests?.data?.map?.((item: any, index: number) => (
                    <>
                      <AppCard
                        item={item}
                        notifications={notifications?.data?.items?.filter?.((notification: any) => notification.sender == item.app_key)}
                        myAppSendEvent={myAppSendEvent}
                      />
                      {index !== requests?.data?.length - 1 && <Divider className="bg-slate-200" />}
                    </>
                  ))}
                </div>
              </div>
            )}
            {deactive_addons?.data?.length > 0 && (
              <div className="flex flex-col gap-2  bg-amber-50/30 rounded-xl p-4">
                <span className="text-sm font-bold text-primary">ابزارک‌های نیازمند به تمدید</span>
                <div className="flex flex-col gap-1">
                  {deactive_addons?.data?.map?.((item: any, index: number) => (
                    <>
                      <AppCard item={item} deactive myAppSendEvent={myAppSendEvent} />
                      {index !== deactive_addons?.data?.length - 1 && <Divider className="bg-slate-200" />}
                    </>
                  ))}
                </div>
              </div>
            )}
            {!showEmptyState && (
              <Button
                size="sm"
                className="px-7"
                variant="text"
                onClick={() => {
                  router.push('/_/apps');
                  myAppSendEvent('open_apps_list');
                }}
                icon={<ToolCaseIcon />}
              >
                مشاهده جعبه ابزار
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter
      className="bg-white"
      showHeader={false}
      showFooter={false}
      shouldShowPromoteApp={false}
      {...page.props.config}
    >
      {page}
    </LayoutWithHeaderAndFooter>
  );
};
export const getServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    return {};
  },
);

export default Page;
