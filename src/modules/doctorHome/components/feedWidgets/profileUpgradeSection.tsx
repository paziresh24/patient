import Switch from '@/common/components/atom/switch';
import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { DsCard } from '../../designSystem';
import { WidgetListRow } from './widgetListRow';
import { getBadgeLabel } from '../../utils/widgetCapabilitySections';

export const ProfileUpgradeSection = ({
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
              onClick={() => onOpenApp(app)}
              isLast={index === apps.length - 1}
              trailing={
                soon ? undefined : (
                  <Switch
                    checked={isActive}
                    onChange={e => {
                      if (e.target.checked && !isActive) {
                        onActivate(app);
                      } else if (!e.target.checked && isActive) {
                        onOpenApp(app);
                      }
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                )
              }
            />
          </li>
        );
      })}
    </ul>
  </DsCard>
);
