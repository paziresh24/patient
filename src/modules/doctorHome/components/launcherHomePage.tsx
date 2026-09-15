import { useEffect } from 'react';
import Seo from '@/common/components/layouts/seo';
import { NotificationPermissionModal } from '@/common/components/atom/notificationPermissionModal';
import Loading from '@/common/components/atom/loading';
import { useLauncherPageAccess } from '@/common/hooks/useLauncherPageAccess';
import { useNotificationPermission } from '@/common/hooks/useNotificationPermission';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import DoctorLauncherContent from '@/modules/doctorHome/components/doctorLauncherContent';
import { DoctorViewSwitcher } from '@/modules/doctorHome/components/doctorViewSwitcher';
import { useDoctorViewRouteGuard } from '@/modules/doctorHome/hooks/useDoctorViewRouteGuard';
import { ds } from '@/modules/doctorHome/designSystem/tokens';

const pageLoading = (
  <div data-doctor-boot-loading className="flex min-h-[50vh] flex-grow items-center justify-center">
    <Loading />
  </div>
);

/** `/_/` body — doctor-only route. Always the new doctor home (no flag / legacy). */
export const LauncherHomePage = () => {
  const { shouldShowLauncher } = useLauncherPageAccess();
  const info = useUserInfoStore(state => state.info);

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
      <NotificationPermissionModal isOpen={showModal} onClose={closeModal} onSuccess={handleSuccess} />

      {shouldShowLauncher ? (
        <>
          <div className={ds.surface.page}>
            <DoctorViewSwitcher forceShow className="px-0 pb-1 pt-3" />
          </div>
          <DoctorLauncherContent />
        </>
      ) : (
        pageLoading
      )}
    </>
  );
};

export default LauncherHomePage;
