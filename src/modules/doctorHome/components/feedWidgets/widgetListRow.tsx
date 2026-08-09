import classNames from '@/common/utils/classNames';
import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';
import { ds } from '../../designSystem';
import type { ReactNode } from 'react';
import { RowChevronIcon } from '../icons';

export const RowChevron = () => <RowChevronIcon size="sm" />;

export const getCapabilityTitle = (app: HamdastCatalogApp) =>
  app.subtitle?.trim() || app.title || app.app_key;

const capabilityBrand = (app: HamdastCatalogApp) => {
  const headline = getCapabilityTitle(app);
  const brand = app.title?.trim() || app.app_key;
  return brand !== headline ? brand : null;
};

export const WidgetAppIcon = ({
  app,
  size = 'default',
}: {
  app: HamdastCatalogApp;
  size?: 'default' | 'compact';
}) => {
  const fallback = (app.title ?? app.app_key).charAt(0).toUpperCase();
  const boxClass =
    size === 'compact'
      ? 'h-9 w-9 rounded-[10px] text-xs'
      : 'h-10 w-10 rounded-xl text-sm';

  if (app.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={app.icon}
        alt=""
        className={classNames('shrink-0 object-cover', boxClass)}
      />
    );
  }

  return (
    <div
      className={classNames(
        'flex shrink-0 items-center justify-center bg-primary/10 font-bold text-primary',
        boxClass,
      )}
    >
      {fallback}
    </div>
  );
};

/** توضیح قابلیت + نام اپ */
export const AppCapabilityContent = ({
  app,
  soon,
  className,
  dense,
}: {
  app: HamdastCatalogApp;
  soon?: boolean;
  className?: string;
  dense?: boolean;
}) => {
  const headline = getCapabilityTitle(app);
  const brand = capabilityBrand(app);

  return (
    <span className={classNames('min-w-0 flex-1', className)}>
      <p
        className={classNames(
          dense ? classNames(ds.type.label, 'leading-4 text-slate-700') : ds.type.cardTitle,
          'line-clamp-2',
          !dense && 'leading-5',
        )}
      >
        {headline}
      </p>
      {brand ? (
        <p
          className={classNames(ds.type.caption, 'mt-0.5 truncate')}
        >
          {brand}
        </p>
      ) : null}
      {soon ? (
        <span className={classNames('mt-1 inline-block rounded-md px-1.5 py-0.5', ds.surface.warningSoft, ds.type.label, 'text-amber-700')}>
          به‌زودی
        </span>
      ) : null}
    </span>
  );
};

export const WidgetListRow = ({
  app,
  trailing,
  onClick,
  isLast,
  soon,
}: {
  app: HamdastCatalogApp;
  trailing?: ReactNode;
  onClick?: () => void;
  isLast?: boolean;
  soon?: boolean;
}) => {
  const rowClass = classNames(
    'flex w-full items-center gap-3 px-4 py-3.5 text-start',
    ds.motion.listRow,
    !isLast && 'border-b border-slate-100',
    onClick && 'active:bg-slate-50 hover:bg-slate-50/80',
  );

  const content = (
    <>
      <WidgetAppIcon app={app} />
      <AppCapabilityContent app={app} soon={soon} />
      {trailing ?? <RowChevron />}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {content}
      </button>
    );
  }

  return <div className={rowClass}>{content}</div>;
};
