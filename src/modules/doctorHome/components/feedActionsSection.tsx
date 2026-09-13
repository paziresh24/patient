import classNames from '@/common/utils/classNames';
import Switch from '@/common/components/atom/switch';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import moment from 'jalali-moment';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useOnlineVisitServices, useToggleOnlineVisit } from '../apis/onlineVisit';
import { DsButton, DsCard, DsSectionHeader, ds } from '../designSystem';
import { DsDrawer } from './DsDrawer';
import { useDoctorHomeSheetHost, useSheetDrawerProps } from '../hooks/doctorHomeSheetLayout';
import { useSheetRoute } from '../hooks/useSheetRoute';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { useSelectedDateStore } from '../store/selectedDate';
import { sendDoctorHomeEvent } from '../utils/analytics';
import { DOCTOR_PANEL_URLS } from '../utils/doctorPanelUrls';
import { formatDoctorCenterName, getType1ClinicCenters, hasOnlineVisitCenter, isType1Center, ONLINE_VISIT_CENTER_ID, shouldShowClinicSection, shouldShowOnlineVisitSection, getOnlineVisitCenter } from '../utils/centers';
import { buildDoctorPanelUrl } from '../utils/iframeUrl';
import { dsFocusRing } from '../utils/a11y';
import {
  BookingSettingsIcon,
  ChatIcon,
  ClinicIcon,
  ClockIcon,
  TariffIcon,
  VacationIcon,
} from './icons';
import { FeedStaggerItem } from './feedContentSwap';
import { RowChevron } from './feedWidgets/widgetListRow';

type ActionId = 'workhours' | 'vacation' | 'tariff' | 'bookingSettings';

const SUB_ACTIONS: {
  id: ActionId;
  label: string;
  hint: string;
  description: string;
  url: string;
  analyticsFeature: 'shortcut_workhours' | 'shortcut_vacation' | 'shortcut_tariff' | 'shortcut_booking_settings';
  icon: typeof ClockIcon;
}[] = [
  {
    id: 'workhours',
    label: 'ساعات کاری',
    hint: 'زمان پذیرش',
    description: 'تنظیم ساعات کاری',
    url: DOCTOR_PANEL_URLS.workhours,
    analyticsFeature: 'shortcut_workhours',
    icon: ClockIcon,
  },
  {
    id: 'vacation',
    label: 'اعلام تعطیلی',
    hint: 'مرخصی مطب',
    description: 'مرخصی',
    url: DOCTOR_PANEL_URLS.vacation,
    analyticsFeature: 'shortcut_vacation',
    icon: VacationIcon,
  },
  {
    id: 'tariff',
    label: 'تعرفه‌ها',
    hint: 'قیمت خدمات',
    description: 'تغییر تعرفه‌ها',
    url: DOCTOR_PANEL_URLS.tariffs,
    analyticsFeature: 'shortcut_tariff',
    icon: TariffIcon,
  },
  {
    id: 'bookingSettings',
    label: 'تنظیمات نوبت‌دهی',
    hint: 'تنظیم محدودیت‌های ثبت نوبت و ...',
    description: 'تنظیمات نوبت‌دهی',
    url: DOCTOR_PANEL_URLS.bookingSettings,
    analyticsFeature: 'shortcut_booking_settings',
    icon: BookingSettingsIcon,
  },
];

const ActionIcon = ({
  children,
  size = 'md',
}: {
  children: ReactNode;
  size?: 'md' | 'lg';
}) => (
  <span
    className={classNames(
      ds.icon.containerAction,
      ds.radius.inner,
      size === 'lg' ? 'h-10 w-10' : 'h-9 w-9',
    )}
  >
    {children}
  </span>
);

const PanelIframeDrawer = ({
  open,
  onClose,
  title,
  description,
  url,
  userId,
  centerId,
  iframeKey,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url: string;
  userId?: string | number | null;
  centerId?: string | null;
  iframeKey: string;
}) => {
  const isSheetHost = useDoctorHomeSheetHost();
  const iframeSrc = buildDoctorPanelUrl(url, { userId, centerId });

  return (
    <DsDrawer
      level={1}
      open={open && isSheetHost}
      onOpenChange={o => {
        if (!o) onClose();
      }}
      title={title}
      description={description}
      fullHeight
      className="!p-0"
    >
      {open && (
        <iframe
          key={`${iframeKey}-${centerId ?? 'all'}`}
          src={iframeSrc}
          title={title}
          className="min-h-0 w-full flex-1 border-0"
        />
      )}
    </DsDrawer>
  );
};

const ActionSheetList = ({
  onSelect,
  actions,
}: {
  onSelect: (id: ActionId) => void;
  actions: typeof SUB_ACTIONS;
}) => (
  <ul className="pb-6">
    {actions.map((action, index) => {
      const Icon = action.icon;
      return (
        <li key={action.id}>
          <FeedStaggerItem index={index}>
          <button
            type="button"
            onClick={() => onSelect(action.id)}
            className={classNames(
              'flex w-full items-center gap-3 text-start',
              ds.motion.listRow,
              ds.layout.rowPaddingWide,
              index < actions.length - 1 && 'border-b border-slate-100',
            )}
          >
            <ActionIcon>
              <Icon size="sm" />
            </ActionIcon>
            <span className="min-w-0 flex-1">
              <p className={ds.type.cardTitle}>{action.label}</p>
              <p className={classNames(ds.type.caption, 'mt-0.5')}>{action.hint}</p>
            </span>
            <RowChevron />
          </button>
          </FeedStaggerItem>
        </li>
      );
    })}
  </ul>
);

const CompactRow = ({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  isLast,
  widgetShell = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  isLast?: boolean;
  widgetShell?: boolean;
}) => (
  <div
    className={classNames(
      'flex items-center gap-2',
      widgetShell ? 'px-5 py-3.5' : ds.layout.rowPadding,
      !isLast && (widgetShell ? 'border-b border-slate-50' : 'border-b border-slate-100'),
    )}
  >
    <button
      type="button"
      onClick={onPress}
      className={classNames('flex min-w-0 flex-1 items-center gap-3 text-start', ds.motion.listRow)}
    >
      <ActionIcon size="lg">
        {icon}
      </ActionIcon>
      <span className="min-w-0 flex-1">
        <p className={ds.type.cardTitle}>{title}</p>
        {subtitle ? <p className={classNames(ds.type.caption, 'mt-0.5 line-clamp-1')}>{subtitle}</p> : null}
      </span>
      {!trailing ? <RowChevron /> : null}
    </button>
    {trailing}
  </div>
);

export const FeedActionsSection = ({
  widgetShell = false,
  hideSectionHeader = false,
}: {
  widgetShell?: boolean;
  hideSectionHeader?: boolean;
}) => {
  const user = useUserInfoStore(state => state.info);
  const userId = user?.id;
  const onlineVisitCenter = getOnlineVisitCenter(user);
  const onlineVisit = {
    userCenterId: (onlineVisitCenter as { user_center_id?: string } | undefined)?.user_center_id,
    hasOnlineVisitCenter: hasOnlineVisitCenter(user),
  };
  const onlineSheet = useSheetRoute('online-visit-actions');
  const clinicSheet = useSheetRoute('clinic-actions');
  const activationSheet = useSheetRoute('online-visit-activation');
  const workhoursSheet = useSheetRoute('workhours');
  const vacationSheet = useSheetRoute('vacation');
  const tariffSheet = useSheetRoute('tariff');
  const bookingSettingsSheet = useSheetRoute('bookingSettings');
  const activationDrawerProps = useSheetDrawerProps(activationSheet);
  const onlineDrawerProps = useSheetDrawerProps(onlineSheet);
  const clinicDrawerProps = useSheetDrawerProps(clinicSheet);

  const selectedCenterId = useSelectedCenterStore(state => state.selectedCenterId);
  const setSelectedCenterId = useSelectedCenterStore(state => state.setSelectedCenterId);
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const selectedMoment = moment(selectedDate, 'YYYY-MM-DD');
  const isToday = selectedMoment.isSame(moment(), 'day');
  const sectionTitle = isToday
    ? 'برنامه امروز'
    : `برنامه ${selectedMoment.clone().locale('fa').format('jD jMMMM')}`;

  const clinics = useMemo(() => getType1ClinicCenters(user), [user]);
  const showOnlineVisit = shouldShowOnlineVisitSection(selectedCenterId);
  const showClinic = shouldShowClinicSection(selectedCenterId, user);
  const activeClinic = useMemo(() => {
    if (!showClinic || clinics.length === 0) return null;
    if (selectedCenterId) {
      return clinics.find(center => String(center.id) === selectedCenterId) ?? clinics[0];
    }
    return clinics[0];
  }, [clinics, selectedCenterId, showClinic]);

  const { data, isLoading: isOnlineVisitQueryLoading } = useOnlineVisitServices(onlineVisit?.userCenterId);
  const isOnlineVisitInitialLoading = isOnlineVisitQueryLoading && data == null;
  const toggleMutation = useToggleOnlineVisit();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(!!data?.data?.some(item => item.active_booking));
  }, [data]);

  const handleToggle = async (checked: boolean) => {
    if (!onlineVisit?.userCenterId || toggleMutation.isLoading) return;
    setIsActive(checked);
    try {
      await toggleMutation.mutateAsync({
        user_center_id: onlineVisit.userCenterId,
        can_booking: checked ? '1' : '0',
      });
      sendDoctorHomeEvent(userId, 'online_visit_toggle', { is_on: checked });
    } catch {
      setIsActive(!checked);
    }
  };

  const [panelCenterId, setPanelCenterId] = useState<string | null>(null);

  const sheets = {
    workhours: workhoursSheet,
    vacation: vacationSheet,
    tariff: tariffSheet,
    bookingSettings: bookingSettingsSheet,
  } as const;
  const actionIds = Object.keys(sheets) as ActionId[];

  const openAction = (id: ActionId, centerId?: string | null) => {
    const action = SUB_ACTIONS.find(item => item.id === id);
    if (!action) return;
    sendDoctorHomeEvent(userId, action.analyticsFeature);
    setPanelCenterId(centerId ?? selectedCenterId);
    // منوی والد در استک می‌ماند؛ بک / بستن iframe به منو برمی‌گردد
    sheets[id].openSheetOver(actionIds.filter(actionId => actionId !== id));
  };

  const resolvedPanelCenterId = panelCenterId ?? selectedCenterId;

  const openOnlineSheet = () => {
    sendDoctorHomeEvent(userId, 'online_visit_actions_open');
    onlineSheet.openSheet();
  };

  const hasClinic = !!activeClinic;
  const showClinicRow = showClinic && hasClinic;
  const clinicTitle = activeClinic ? formatDoctorCenterName(activeClinic) : '';
  const clinicAddress = activeClinic?.address?.trim() || activeClinic?.city?.trim();
  const clinicSubtitle =
    clinics.length > 1 && !selectedCenterId
      ? `${clinics.length.toLocaleString('fa-IR')} مطب`
      : clinicAddress;

  const onlineActions = useMemo(
    () =>
      SUB_ACTIONS.map(action => {
        if (action.id === 'vacation') return { ...action, hint: 'مرخصی ویزیت آنلاین' };
        if (action.id === 'bookingSettings') return { ...action, hint: 'تنظیم محدودیت‌های گفت‌وگو' };
        return action;
      }),
    [],
  );
  const clinicActions = useMemo(
    () =>
      SUB_ACTIONS.filter(
        action => action.id !== 'bookingSettings' || isType1Center(activeClinic),
      ),
    [activeClinic],
  );

  if (!showOnlineVisit && !showClinicRow) return null;

  return (
    <section dir="rtl">
      {!hideSectionHeader && <DsSectionHeader title={sectionTitle} />}
      <DsCard padding="none" variant={widgetShell ? 'widget' : 'default'} className="overflow-hidden">
        {hideSectionHeader && (
          <div className="border-b border-slate-100 px-3 py-2.5">
            <p className={ds.type.section}>{sectionTitle}</p>
          </div>
        )}
        {showOnlineVisit && (
          <CompactRow
            icon={<ChatIcon size="md" />}
            title="ویزیت آنلاین"
            widgetShell={widgetShell}
            subtitle={
              !onlineVisit.hasOnlineVisitCenter
                ? 'فعال‌سازی نوبت آنلاین'
                : isOnlineVisitInitialLoading
                  ? 'در حال بررسی…'
                  : isActive
                    ? 'نوبت‌دهی فعال'
                    : 'نوبت‌دهی غیرفعال'
            }
            isLast={!showClinicRow}
            trailing={
              onlineVisit.hasOnlineVisitCenter ? (
                <>
                  <Switch
                    checked={isActive}
                    onChange={e => handleToggle(e.target.checked)}
                    disabled={isOnlineVisitInitialLoading || toggleMutation.isLoading}
                    aria-label="فعال‌سازی نوبت‌دهی آنلاین"
                  />
                  <button type="button" aria-label="تنظیمات ویزیت آنلاین" onClick={openOnlineSheet} className={classNames('shrink-0 p-1', dsFocusRing)}>
                    <RowChevron />
                  </button>
                </>
              ) : (
                <DsButton variant="primary" className="!h-8 !min-h-0 !px-2.5 !py-1" onClick={() => activationSheet.openSheet()}>
                  شروع
                </DsButton>
              )
            }
            onPress={() => {
              if (!onlineVisit.hasOnlineVisitCenter) {
                activationSheet.openSheet();
                return;
              }
              openOnlineSheet();
            }}
          />
        )}

        {showClinicRow && (
          <CompactRow
            icon={<ClinicIcon size="md" />}
            title={clinicTitle}
            subtitle={clinicSubtitle}
            widgetShell={widgetShell}
            isLast
            onPress={() => {
              sendDoctorHomeEvent(userId, 'clinic_actions_open');
              clinicSheet.openSheet();
            }}
          />
        )}
      </DsCard>

      <DsDrawer
        {...activationDrawerProps}
        title="فعال‌سازی ویزیت آنلاین"
        description="راهنمای فعال‌سازی"
      >
        <div className="flex flex-col items-center gap-4 px-4 pb-10 pt-2 text-center">
          <ActionIcon size="lg">
            <ChatIcon size="lg" />
          </ActionIcon>
          <p className={classNames(ds.type.cardBody, 'leading-6')}>
            برای فعال‌سازی ویزیت آنلاین، ابتدا پروفایل خود را در پنل پزشکی پذیرش۲۴ تکمیل کنید.
          </p>
        </div>
      </DsDrawer>

      <DsDrawer
        {...onlineDrawerProps}
        title="ویزیت آنلاین"
        description="مدیریت نوبت آنلاین"
      >
        <ActionSheetList
          actions={onlineActions}
          onSelect={id => openAction(id, ONLINE_VISIT_CENTER_ID)}
        />
      </DsDrawer>

      <DsDrawer
        {...clinicDrawerProps}
        title={clinicTitle}
        description="مدیریت مطب"
      >
        {clinics.length > 1 && (
          <div role="group" aria-label="انتخاب مطب" className="mb-1 flex gap-2 overflow-x-auto px-3 pb-2 pt-1 no-scroll">
            {clinics.map(clinic => {
              const clinicId = String(clinic.id);
              const isSelected = String(activeClinic?.id) === clinicId;
              const name = formatDoctorCenterName(clinic);

              return (
                <button
                  key={clinicId}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedCenterId(clinicId);
                    sendDoctorHomeEvent(userId, 'clinic_picker_select', { center_id: clinicId });
                  }}
                  className={classNames(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5',
                    ds.motion.surface,
                    ds.motion.press,
                    ds.type.label,
                    dsFocusRing,
                    isSelected
                      ? classNames(ds.surface.muted, 'border-slate-300 text-slate-800')
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <ClinicIcon size="xs" />
                  {name}
                </button>
              );
            })}
          </div>
        )}
        <ActionSheetList
          actions={clinicActions}
          onSelect={id => openAction(id, activeClinic ? String(activeClinic.id) : null)}
        />
      </DsDrawer>

      {SUB_ACTIONS.map(action => (
        <PanelIframeDrawer
          key={action.id}
          open={sheets[action.id].open}
          onClose={() => {
            sheets[action.id].closeSheet();
            setPanelCenterId(null);
          }}
          title={action.label}
          description={action.description}
          url={action.url}
          userId={userId}
          centerId={resolvedPanelCenterId}
          iframeKey={action.id}
        />
      ))}
    </section>
  );
};
