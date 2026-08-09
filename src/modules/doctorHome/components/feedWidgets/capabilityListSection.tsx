import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { DsCard } from '../../designSystem';
import { RowChevron, WidgetListRow } from './widgetListRow';
import { getBadgeLabel } from '../../utils/widgetCapabilitySections';

export const CapabilityListSection = ({
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
  <DsCard padding="none" className="overflow-hidden !shadow-sm">
    <ul>
      {apps.map((app, index) => {
        const isActive = installedKeys.has(app.app_key);
        const soon = getBadgeLabel(app.badges) === 'به‌زودی';

        return (
          <li key={app.app_key}>
            <WidgetListRow
              app={app}
              soon={soon}
              onClick={() => (soon ? onOpenApp(app) : isActive ? onOpenApp(app) : onActivate(app))}
              isLast={index === apps.length - 1}
              trailing={<RowChevron />}
            />
          </li>
        );
      })}
    </ul>
  </DsCard>
);
