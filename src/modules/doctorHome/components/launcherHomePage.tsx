import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Seo from '@/common/components/layouts/seo';
import useModal from '@/common/hooks/useModal';
import { NotificationPermissionModal } from '@/common/components/atom/notificationPermissionModal';
import Loading from '@/common/components/atom/loading';
import { useLauncherPageAccess } from '@/common/hooks/useLauncherPageAccess';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import { useNotificationPermission } from '@/common/hooks/useNotificationPermission';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useQueryClient } from '@tanstack/react-query';
import DoctorLauncherContent from '@/modules/doctorHome/components/doctorLauncherContent';
import { DoctorViewSwitcher } from '@/modules/doctorHome/components/doctorViewSwitcher';
import { useDoctorViewRouteGuard } from '@/modules/doctorHome/hooks/useDoctorViewRouteGuard';
import { useDoctorViewSwapActive } from '@/modules/doctorHome/hooks/useDoctorViewSwapActive';
import {
  useIsNewDoctorLauncherEnabled,
  useIsNewDoctorLauncherLoading,
} from '@/modules/doctorHome/hooks/useNewDoctorLauncher';
import { ds } from '@/modules/doctorHome/designSystem/tokens';

const pageLoading = (
  <div data-doctor-boot-loading className="flex min-h-[50vh] flex-grow items-center justify-center">
    <Loading />
  </div>
);

const LegacyLauncherSection = dynamic(() => import('src/pages/_/legacyLauncherSection'), {
  loading: () => pageLoading,
  ssr: false,
});

const HamdastAppModal = dynamic(() => import('@/modules/hamdast/components/appModal'), {
  ssr: false,
});

const AppFrame = dynamic(() => import('@/modules/hamdast/appFrame'), {
  ssr: false,
});

/**
 * `/_/` body — doctor-only route. SSG always emits doctor chrome + feed shell.
 * Never gate the feed behind Loading when building new home; persist fills sections.
 * Legacy only after conclusive flag-off (enabled false, not loading, no doctor identity optimism).
 */
export const LauncherHomePage = () => {
  const queryClient = useQueryClient();
  const { handleOpen, handleClose, modalProps } = useModal();
  const [app, setApp] = useState<string>('');
  const [appRunFullscreen, setAppRunFullscreen] = useState(false);
  const swapActive = useDoctorViewSwapActive();
  const doctorLauncherLoading = useIsNewDoctorLauncherLoading();
  const doctorLauncherEnabled = useIsNewDoctorLauncherEnabled();
  const { isResolving, shouldShowLauncher, isDoctor: launcherDoctorIdentity } = useLauncherPageAccess();
  const info = useUserInfoStore(state => state.info);

  const showLegacy =
    !doctorLauncherLoading &&
    !doctorLauncherEnabled &&
    !swapActive &&
    !launcherDoctorIdentity &&
    !isResolving &&
    shouldShowLauncher;

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
      <NotificationPermissionModal isOpen={showModal} onClose={closeModal} onSuccess={handleSuccess} />

      {showLegacy ? (
        <LegacyLauncherSection
          onAction={action => {
            if (action.action === 'OPEN_APP') {
              void prefetchOneApp(queryClient, { appKey: action.appKey, pageKey: 'launcher' }, 0);
              setApp(action.appKey);
              handleOpen();
            }
          }}
        />
      ) : (
        <>
          <div className={ds.surface.page}>
            <DoctorViewSwitcher forceShow className="px-0 pb-1 pt-3" />
          </div>
          <DoctorLauncherContent />
        </>
      )}
    </>
  );
};

export default LauncherHomePage;
