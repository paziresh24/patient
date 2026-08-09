import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import classNames from '@/common/utils/classNames';
import { DsCard, ds } from '../../designSystem';
import { RowChevron, WidgetListRow } from './widgetListRow';

export const SocialBannerSection = ({
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
      const isActive = installedKeys.has(app.app_key);

      return (
        <DsCard key={app.app_key} padding="none" className={classNames('overflow-hidden !shadow-sm', ds.surface.socialAccent)}>
          <WidgetListRow
            app={app}
            onClick={() => (isActive ? onOpenApp(app) : onActivate(app))}
            trailing={<RowChevron />}
          />
        </DsCard>
      );
    })}
  </div>
);
