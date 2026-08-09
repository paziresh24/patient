import classNames from '@/common/utils/classNames';
import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { getWidgetActionLabel } from '../../hooks/useInstalledAppKeys';
import { ds } from '../../designSystem';
import { AppCapabilityContent } from './widgetListRow';
import { getBadgeLabel } from '../../utils/widgetCapabilitySections';

export const AssistantCarouselSection = ({
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
  <div className={ds.layout.carouselStripTight}>
    {apps.map(app => {
      const soon = getBadgeLabel(app.badges) === 'به‌زودی';
      const isActive = installedKeys.has(app.app_key);
      const actionLabel = getWidgetActionLabel(isActive, { soon });

      return (
        <button
          key={app.app_key}
          type="button"
          onClick={() => (soon ? onOpenApp(app) : isActive ? onOpenApp(app) : onActivate(app))}
          className={classNames(
            ds.radius.card,
            ds.surface.tile,
            ds.shadow.sm,
            'flex w-[12.5rem] shrink-0 snap-start flex-col border p-3 text-start',
            isActive ? ds.surface.activeAccent : 'border-slate-100',
            'transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.98] hover:shadow-md',
          )}
        >
          <AppCapabilityContent app={app} soon={soon} />
          {!soon ? (
            <span
              className={classNames(
                'mt-2.5',
                ds.type.badge,
                isActive ? 'text-slate-500' : ds.type.link,
              )}
            >
              {actionLabel}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);
