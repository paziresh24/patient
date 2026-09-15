import Skeleton from '@/common/components/atom/skeleton';
import classNames from '@/common/utils/classNames';
import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { useHamdastAppCatalog } from '@/modules/hamdast/apis/appList';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { DsCard, ds } from '../designSystem';
import { useDoctorHomeAppModal } from '../hooks/useDoctorHomeAppModal';
import { useInstalledAppKeys } from '../hooks/useInstalledAppKeys';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { dsFocusRing } from '../utils/a11y';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { groupActiveAppsByCategory } from '../utils/widgetCapabilitySections';
import { ActiveWidgetRow } from './feedWidgets/activeWidgetsCard';
import { ToolboxIcon } from './icons';
import { ToolboxDrawer } from './toolboxDrawer';

export const FeedWidgetsSection = ({ widgetShell = false }: { widgetShell?: boolean }) => {
  const userId = useUserInfoStore(state => state.info?.id);
  const openDoctorHomeApp = useDoctorHomeAppModal();
  const toolboxSheet = useSheetRoute('toolbox');
  const [sectionRef, inView] = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
  const shouldFetch = inView || toolboxSheet.open;
  const { data: apps, isLoading } = useHamdastAppCatalog({ enabled: shouldFetch });
  const { installedKeys } = useInstalledAppKeys(userId, { enabled: shouldFetch });

  const activeApps = useMemo(
    () => (apps ? groupActiveAppsByCategory(apps, installedKeys).flatMap(group => group.apps) : []),
    [apps, installedKeys],
  );

  const openApp = (app: HamdastCatalogApp) => {
    sendDoctorHomeEvent(userId, 'widget_open', { app_key: app.app_key, title: app.title });
    openDoctorHomeApp(app.app_key);
  };

  const openToolbox = () => {
    sendDoctorHomeEvent(userId, 'tools_see_all');
    toolboxSheet.openSheet();
  };

  const countLabel =
    activeApps.length > 0
      ? `${activeApps.length.toLocaleString('fa-IR')} ابزارک فعال`
      : 'جعبه ابزار و افزونه‌ها';
  const pad = widgetShell ? 'px-5 py-3.5' : ds.layout.rowPadding;

  return (
    <>
      <section ref={sectionRef} dir="rtl" aria-label="ابزارک‌ها">
        <DsCard padding="none" variant={widgetShell ? 'widget' : 'default'} className="overflow-hidden">
          <div className={classNames('flex items-center gap-3', pad)}>
            <span className={classNames('h-10 w-10', ds.icon.containerAction, ds.radius.inner)}>
              <ToolboxIcon size="md" />
            </span>
            <span className="min-w-0 flex-1">
              <p className={ds.type.cardTitle}>ابزارک‌ها</p>
              <p className={classNames(ds.type.caption, 'mt-0.5')}>
                {isLoading && !apps ? 'در حال بارگذاری…' : countLabel}
              </p>
            </span>
            <button
              type="button"
              onClick={openToolbox}
              className={classNames(
                'shrink-0 rounded-full px-3 py-1.5',
                ds.surface.primarySoft,
                ds.type.pill,
                ds.motion.press,
                dsFocusRing,
              )}
            >
              جعبه ابزار
            </button>
          </div>

          {isLoading && !apps ? (
            <div className={classNames('border-t border-slate-100', pad)}>
              <Skeleton h="2.5rem" w="100%" rounded="lg" />
            </div>
          ) : (
            activeApps.map((app, index) => (
              <ActiveWidgetRow
                key={app.app_key}
                app={app}
                onClick={() => openApp(app)}
                isLast={index === activeApps.length - 1}
                isFirst={index === 0}
                widgetShell={widgetShell}
              />
            ))
          )}
        </DsCard>
      </section>
      <ToolboxDrawer
        open={toolboxSheet.open}
        onOpenChange={open => {
          if (!open) toolboxSheet.closeSheet();
        }}
        onBeforeOpenApp={() => toolboxSheet.closeSheet('replace')}
      />
    </>
  );
};
