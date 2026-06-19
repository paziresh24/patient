import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement, useEffect, useState } from 'react';
import LauncherMain from '.plasmic/LauncherMain';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';
import Seo from '@/common/components/layouts/seo';
import useModal from '@/common/hooks/useModal';
import { NotificationPermissionModal } from '@/common/components/atom/notificationPermissionModal';
import Loading from '@/common/components/atom/loading';
import { useLauncherPageAccess } from '@/common/hooks/useLauncherPageAccess';
import { AppFrame } from '@/modules/hamdast/appFrame';
import { HamdastAppModal } from '@/modules/hamdast/components/appModal';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import { useNotificationPermission } from '@/common/hooks/useNotificationPermission';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useQueryClient } from '@tanstack/react-query';

const Page = () => {
  const queryClient = useQueryClient();
  const { handleOpen, handleClose, modalProps } = useModal();
  const [app, setApp] = useState<string>('');
  const { isResolving, shouldShowLauncher } = useLauncherPageAccess();
  const info = useUserInfoStore(state => state.info)
  const { isSupported, hasPermission, showModal, openModal, closeModal, checkPermission } = useNotificationPermission();

  useEffect(() => {
    window?.clarity?.('upgrade', 'LauncherMain');
  }, []);

  const handleSuccess = () => {
    checkPermission();
  };

  useEffect(() => {

    if (isSupported && !hasPermission && info?.is_doctor) {
      openModal();
    }
  }, [isSupported, hasPermission, info])


  return (
    <>
      <Seo title="خدمات" noIndex />

      <HamdastAppModal {...modalProps} title="اپلیکیشن">
        <AppFrame appKey={app} params={['launcher']} onHamdastClose={handleClose} />
      </HamdastAppModal>
      <NotificationPermissionModal
        isOpen={showModal}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
      {isResolving && (
        <div className="flex min-h-[50vh] flex-grow items-center justify-center">
          <Loading />
        </div>
      )}
      {!isResolving && shouldShowLauncher && (
        <GlobalContextsProvider>
          <LauncherMain
            onAction={action => {
              if (action.action === 'OPEN_APP') {
                void prefetchOneApp(queryClient, { appKey: action.appKey, pageKey: 'launcher' }, 0);
                setApp(action.appKey);
                handleOpen();
              }
            }}
          />
        </GlobalContextsProvider>
      )}
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} className="bg-[#F2F3F5]" shouldShowPromoteApp={false} showFooter={false}>
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
