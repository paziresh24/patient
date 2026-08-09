import classNames from '@/common/utils/classNames';
import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { DsCard, ds } from '../../designSystem';
import type { ActiveWidgetGroup } from '../../utils/widgetCapabilitySections';
import { RowChevron, AppCapabilityContent, WidgetAppIcon } from './widgetListRow';

const GROUP_LABEL: Record<ActiveWidgetGroup['id'], string> = {
  assistant: 'دستیاران',
  profile: 'ابزارک‌های پروفایل',
  other: 'سایر ابزارک‌ها',
};

const WidgetRow = ({
  app,
  onClick,
  isLast,
  widgetShell = false,
}: {
  app: HamdastCatalogApp;
  onClick: () => void;
  isLast?: boolean;
  widgetShell?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'flex w-full items-center gap-3 text-start',
      ds.motion.listRow,
      widgetShell ? 'px-5 py-3.5' : ds.layout.rowPadding,
      !isLast && (widgetShell ? 'border-b border-slate-50' : 'border-b border-slate-100'),
    )}
  >
    <WidgetAppIcon app={app} size="compact" />
    <AppCapabilityContent app={app} dense className="text-right" />
    <RowChevron />
  </button>
);

export const ActiveWidgetsCard = ({
  groups,
  onOpenApp,
  widgetShell = false,
}: {
  groups: ActiveWidgetGroup[];
  onOpenApp: (app: HamdastCatalogApp) => void;
  widgetShell?: boolean;
}) => (
  <DsCard padding="none" variant={widgetShell ? 'widget' : 'default'} className="overflow-hidden">
    {groups.map((group, groupIndex) => (
      <div key={group.id}>
        <div
          className={classNames(
            ds.surface.neutralSoft,
            widgetShell ? 'border-b border-slate-50' : 'border-b border-slate-100',
            widgetShell ? 'px-5 py-2' : ds.layout.groupLabelPadding,
            groupIndex === 0 && (widgetShell ? 'rounded-t-3xl' : 'rounded-t-2xl'),
          )}
        >
          <span className={ds.type.label}>{GROUP_LABEL[group.id]}</span>
        </div>
        {group.apps.map((app, index) => (
          <WidgetRow
            key={app.app_key}
            app={app}
            onClick={() => onOpenApp(app)}
            isLast={index === group.apps.length - 1 && groupIndex === groups.length - 1}
            widgetShell={widgetShell}
          />
        ))}
      </div>
    ))}
  </DsCard>
);
