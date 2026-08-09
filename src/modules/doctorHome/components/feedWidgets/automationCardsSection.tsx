import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import classNames from '@/common/utils/classNames';
import { getWidgetActionLabel } from '../../hooks/useInstalledAppKeys';
import { DsButton, DsCard, ds } from '../../designSystem';
import { AppCapabilityContent } from './widgetListRow';
import { getBadgeLabel } from '../../utils/widgetCapabilitySections';

export const AutomationCardsSection = ({
  apps,
  installedKeys,
  onOpenApp,
  onActivate,
}: {
  apps: HamdastCatalogApp[];
  installedKeys: Set<string>;
  onOpenApp: (app: HamdastCatalogApp) => void;
  onActivate: (app: HamdastCatalogApp) => void;
}) => (
  <div className="space-y-2">
    {apps.map(app => {
      const soon = getBadgeLabel(app.badges) === 'به‌زودی';
      const isActive = installedKeys.has(app.app_key);
      const actionLabel = getWidgetActionLabel(isActive, { soon });

      return (
        <DsCard key={app.app_key} padding="md" className="!shadow-sm">
          <div className={classNames('flex items-start', ds.layout.listRowGap)}>
            <AppCapabilityContent app={app} soon={soon} />
            <DsButton
              variant={isActive ? 'ghost' : 'primary'}
              className="!h-8 shrink-0 !min-h-0 !px-3 !py-1.5"
              onClick={() => (soon ? onOpenApp(app) : isActive ? onOpenApp(app) : onActivate(app))}
            >
              {actionLabel}
            </DsButton>
          </div>
        </DsCard>
      );
    })}
  </div>
);
