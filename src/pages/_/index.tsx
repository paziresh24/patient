import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect, useState } from 'react';
import Seo from '@/common/components/layouts/seo';
import useModal from '@/common/hooks/useModal';
import { NotificationPermissionModal } from '@/common/components/atom/notificationPermissionModal';
import Loading from '@/common/components/atom/loading';
import { useLauncherPageAccess } from '@/common/hooks/useLauncherPageAccess';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import { useNotificationPermission } from '@/common/hooks/useNotificationPermission';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useQueryClient } from '@tanstack/react-query';
import { DoctorViewSwitcher } from '@/modules/doctorHome/components/doctorViewSwitcher';
import { useDoctorViewRouteGuard } from '@/modules/doctorHome/hooks/useDoctorViewRouteGuard';
import { useDoctorViewSwapActive } from '@/modules/doctorHome/hooks/useDoctorViewSwapActive';
import { useIsNewDoctorLauncherLoading } from '@/modules/doctorHome/hooks/useNewDoctorLauncher';
import { ds } from '@/modules/doctorHome/designSystem/tokens';

const pageLoading = (
  <div className="flex min-h-[50vh] flex-grow items-center justify-center">
    <Loading />
  </div>
);

const DoctorLauncherContent = dynamic(() => import('@/modules/doctorHome/components/doctorLauncherContent'), {
  loading: () => pageLoading,
});

const LegacyLauncherSection = dynamic(() => import('./legacyLauncherSection'), {
  loading: () => pageLoading,
});

const HamdastAppModal = dynamic(() => import('@/modules/hamdast/components/appModal'), {
  ssr: false,
});

const AppFrame = dynamic(() => import('@/modules/hamdast/appFrame'), {
  ssr: false,
});

const Page = () => {
  const queryClient = useQueryClient();
  const { handleOpen, handleClose, modalProps } = useModal();
  const [app, setApp] = useState<string>('');
  const [appRunFullscreen, setAppRunFullscreen] = useState(false);
  const swapActive = useDoctorViewSwapActive();
  const doctorLauncherLoading = useIsNewDoctorLauncherLoading();
  const { isResolving, shouldShowLauncher } = useLauncherPageAccess();
  const info = useUserInfoStore(state => state.info);
  const showSwitcher = swapActive || doctorLauncherLoading;

  useDoctorViewRouteGuard();
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
  }, [isSupported, hasPermission, info]);

  return (
    <>
      <Seo title="خدمات" noIndex />

      <HamdastAppModal {...modalProps} title="اپلیکیشن" runFullscreen={appRunFullscreen}>
        <AppFrame
          key={app}
          appKey={app}
          params={['launcher']}
          onHamdastClose={handleClose}
          onRunFullscreenChange={setAppRunFullscreen}
        />
      </HamdastAppModal>
      <NotificationPermissionModal
        isOpen={showModal}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
      {showSwitcher ? (
        <>
          <div className={ds.surface.page}>
            <DoctorViewSwitcher className="px-0 pb-1 pt-3" />
          </div>
          {doctorLauncherLoading ? (
            <div className="flex min-h-[50vh] flex-grow items-center justify-center">
              <Loading />
            </div>
          ) : (
            <DoctorLauncherContent />
          )}
        </>
      ) : (
        <>
          {isResolving && (
            <div className="flex min-h-[50vh] flex-grow items-center justify-center">
              <Loading />
            </div>
          )}
          {!isResolving && shouldShowLauncher && (
            <LegacyLauncherSection
              onAction={action => {
                if (action.action === 'OPEN_APP') {
                  void prefetchOneApp(queryClient, { appKey: action.appKey, pageKey: 'launcher' }, 0);
                  setApp(action.appKey);
                  handleOpen();
                }
              }}
            />
          )}
        </>
      )}
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} className={ds.surface.page} shouldShowPromoteApp={false} showFooter={false}>
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
