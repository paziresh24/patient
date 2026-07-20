'use client';

/**
 * Eager CSS for toolbox Plasmic blocks — avoids FOUC when the sheet opens
 * and FeaturedApps mounts for the first time (CSS modules otherwise arrive with the chunk paint).
 */
import '../../../../.plasmic/plasmic/launcher/PlasmicLauncherBlocksFeaturedApps.module.css';
import '../../../../.plasmic/plasmic/launcher/PlasmicLauncherComponentsApp.module.css';
import '../../../../.plasmic/plasmic/launcher/PlasmicLauncherComponentsTitle.module.css';

import LauncherBlocksFeaturedApps from '.plasmic/LauncherBlocksFeaturedApps';
import { useEffect, useState } from 'react';
import { useDoctorHomeAppModal } from '../hooks/useDoctorHomeAppModal';
import { useDoctorHomeSheetHost } from '../hooks/doctorHomeSheetLayout';
import { DsDrawer } from './DsDrawer';

interface ToolboxDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBeforeOpenApp?: () => void;
}

export const ToolboxDrawer = ({ open, onOpenChange, onBeforeOpenApp }: ToolboxDrawerProps) => {
  const openDoctorHomeApp = useDoctorHomeAppModal();
  const isSheetHost = useDoctorHomeSheetHost();
  /** Keep FeaturedApps mounted after first open so CSS/data don't flash on reopen. */
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  useEffect(() => {
    void import('.plasmic/LauncherBlocksFeaturedApps');
  }, []);

  const showContent = open && isSheetHost;
  const mountContent = showContent || hasOpened;

  return (
    <DsDrawer
      open={showContent}
      onOpenChange={onOpenChange}
      title="جعبه ابزار"
      description="اپلیکیشن‌ها و ابزارهای پزشک"
      fullHeight
      className="!p-0"
    >
      {mountContent ? (
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 [-webkit-overflow-scrolling:touch] [touch-action:pan-y]"
          hidden={!showContent}
          aria-hidden={!showContent}
        >
          <LauncherBlocksFeaturedApps
            openAppFrame={key => {
              onBeforeOpenApp?.();
              openDoctorHomeApp(key);
            }}
          />
        </div>
      ) : null}
    </DsDrawer>
  );
};
