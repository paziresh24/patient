import classNames from '@/common/utils/classNames';
import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { ds } from '../../designSystem';
import { RowChevron, getCapabilityTitle, WidgetAppIcon } from './widgetListRow';

export const ActiveWidgetRow = ({
  app,
  onClick,
  isLast,
  isFirst,
  widgetShell = false,
}: {
  app: HamdastCatalogApp;
  onClick: () => void;
  isLast?: boolean;
  isFirst?: boolean;
  widgetShell?: boolean;
}) => {
  const title = app.title?.trim() || app.app_key;
  const caption = getCapabilityTitle(app);
  const showCaption = caption !== title;

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'flex w-full items-center gap-3 text-start',
        ds.motion.listRow,
        widgetShell ? 'px-5 py-3.5' : ds.layout.rowPadding,
        isFirst && (widgetShell ? 'border-t border-slate-50' : 'border-t border-slate-100'),
        !isLast && (widgetShell ? 'border-b border-slate-50' : 'border-b border-slate-100'),
      )}
    >
      <span className={classNames('h-10 w-10 overflow-hidden', ds.icon.containerAction, ds.radius.inner)}>
        <WidgetAppIcon app={app} size="compact" />
      </span>
      <span className="min-w-0 flex-1">
        <p className={ds.type.cardTitle}>{title}</p>
        {showCaption ? (
          <p className={classNames(ds.type.caption, 'mt-0.5 line-clamp-1')}>{caption}</p>
        ) : null}
      </span>
      <RowChevron />
    </button>
  );
};
