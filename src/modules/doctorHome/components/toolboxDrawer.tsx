'use client';

/**
 * Eager CSS for toolbox Plasmic blocks — avoids FOUC when the sheet opens
 * and FeaturedApps mounts for the first time (CSS modules otherwise arrive with the chunk paint).
 * Title text depends on project tokens in plasmic.module.css, not only Title.module.css.
 */
import '@plasmicapp/react-web/lib/plasmic.css';
import '../../../../.plasmic/plasmic/launcher/plasmic.module.css';
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
  /** Warm-mount FeaturedApps (hidden) so Plasmic CSS is applied before the first visible open. */
  const [warmed, setWarmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const warm = () => {
      if (!cancelled) setWarmed(true);
    };
    // Prefer idle so doctor-home first paint stays light; fall back on slow devices.
    const ric = window.requestIdleCallback?.(warm, { timeout: 1200 });
    if (ric == null) {
      const t = window.setTimeout(warm, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }
    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(ric);
    };
  }, []);

  const showContent = open && isSheetHost;
  const mountContent = warmed || showContent;

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
              openDoctorHomeApp(key);
              onBeforeOpenApp?.();
            }}
          />
        </div>
      ) : null}
    </DsDrawer>
  );
};
