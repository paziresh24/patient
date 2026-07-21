import { UserInfo } from '@/modules/login/store/userInfo';
import type { RaviCenter } from '@/modules/rate-and-review';

export const ONLINE_VISIT_CENTER_ID = '5532';

export interface DoctorCenterOption {
  id: string | null;
  name: string;
  addressHint?: string;
}

type ProviderCenter = {
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  center_type?: number;
  type_id?: number;
  user_center_id?: string;
};

export const getDoctorSlug = (user?: UserInfo) => user?.provider?.slug;

export const getOnlineVisitCenter = (user?: UserInfo) =>
  user?.provider?.centers?.find((center: { id?: string }) => center.id === ONLINE_VISIT_CENTER_ID);

/** type 1 = مطب شخصی */
export const isType1Center = (center?: ProviderCenter | null) => {
  if (!center) return false;
  const type = center.type_id ?? center.center_type;
  return type === 1;
};

export const getClinicCenters = (user?: UserInfo) =>
  user?.provider?.centers?.filter((center: { id?: string }) => center.id !== ONLINE_VISIT_CENTER_ID) ?? [];

/** فقط مطب‌های شخصی (type 1) — برای منوی اقدامات هوم دکتر */
export const getType1ClinicCenters = (user?: UserInfo) =>
  getClinicCenters(user).filter((center: ProviderCenter) => isType1Center(center));

export const hasOnlineVisitCenter = (user?: UserInfo) => !!getOnlineVisitCenter(user);

export const formatDoctorCenterName = (center: ProviderCenter) => {
  if (center.id === ONLINE_VISIT_CENTER_ID) return 'ویزیت آنلاین';
  return center.name?.trim() || 'مرکز';
};

const shortenCenterAddress = (center: ProviderCenter): string | undefined => {
  if (center.id === ONLINE_VISIT_CENTER_ID) return undefined;

  const raw = center.address?.trim() || center.city?.trim();
  if (!raw) return undefined;

  const firstSegment = raw.split(/[،,|-]/)[0]?.trim() || raw;
  const maxLen = 32;

  if (firstSegment.length <= maxLen) return firstSegment;
  return `${firstSegment.slice(0, maxLen).trim()}…`;
};


export const getDoctorCenterOptions = (user?: UserInfo): DoctorCenterOption[] => {
  const onlineCenter = getOnlineVisitCenter(user);
  const clinicCenters = getClinicCenters(user);
  const centers = [
    ...(onlineCenter ? [onlineCenter] : []),
    ...clinicCenters,
  ].filter((center: ProviderCenter) => center.id);

  if (centers.length === 0) return [];

  return [
    { id: null, name: 'همه' },
    ...centers.map((center: ProviderCenter) => ({
      id: String(center.id),
      name: formatDoctorCenterName(center),
      addressHint: shortenCenterAddress(center),
    })),
  ];
};

export const getRaviCentersFromUser = (user?: UserInfo): RaviCenter[] =>
  getDoctorCenterOptions(user)
    .filter((center): center is DoctorCenterOption & { id: string } => !!center.id)
    .map(center => ({ id: center.id, name: center.name }));

export const resolveAppointmentCenters = (user?: UserInfo, selectedCenterId?: string | null) => {
  const all = (user?.provider?.centers ?? [])
    .map((center: { id?: string }) => ({ id: center.id }))
    .filter((center): center is { id: string } => !!center.id);

  if (!selectedCenterId) return all;
  return all.filter(center => center.id === selectedCenterId);
};

export interface VacationCenterTarget {
  /** شناسه مرکز برای فیلتر UI (همان center.id) */
  centerId: string;
  /** شناسه‌ای که API مرخصی در path می‌پذیرد */
  apiId: string;
}

export const getVacationCenterTargets = (user?: UserInfo): VacationCenterTarget[] =>
  (user?.provider?.centers ?? [])
    .filter((center: ProviderCenter) => center.id)
    .map((center: ProviderCenter) => {
      const centerId = String(center.id);
      return { centerId, apiId: centerId };
    });

export const resolveCountCenterId = (user?: UserInfo, selectedCenterId?: string | null) => {
  if (selectedCenterId) {
    const center = (user?.provider?.centers ?? []).find(
      (item: ProviderCenter) => String(item.id) === selectedCenterId,
    ) as ProviderCenter | undefined;

    if (center?.user_center_id) return String(center.user_center_id);
    return selectedCenterId;
  }

  const centers = user?.provider?.centers ?? [];
  const withUserCenterId = centers.find((center: ProviderCenter) => center.user_center_id);
  if (withUserCenterId?.user_center_id) return String(withUserCenterId.user_center_id);

  const onlineCenter = getOnlineVisitCenter(user) as ProviderCenter | undefined;
  if (onlineCenter?.user_center_id) return String(onlineCenter.user_center_id);

  const firstClinic = getClinicCenters(user)[0] as ProviderCenter | undefined;
  if (firstClinic?.id) return String(firstClinic.id);

  return undefined;
};

export const shouldShowOnlineVisitSection = (selectedCenterId?: string | null) =>
  !selectedCenterId || selectedCenterId === ONLINE_VISIT_CENTER_ID;

/** منوی مطب فقط برای type 1؛ بقیه مراکز فقط فیلتر/مراجعین دارند */
export const shouldShowClinicSection = (selectedCenterId?: string | null, user?: UserInfo) => {
  if (selectedCenterId === ONLINE_VISIT_CENTER_ID) return false;
  if (!selectedCenterId) return getType1ClinicCenters(user).length > 0;

  const center = (user?.provider?.centers ?? []).find(
    (item: ProviderCenter) => String(item.id) === selectedCenterId,
  ) as ProviderCenter | undefined;

  return isType1Center(center);
};

export const matchesSelectedCenter = (
  itemCenterId: string | number | null | undefined,
  selectedCenterId?: string | null,
) => !selectedCenterId || String(itemCenterId ?? '') === selectedCenterId;
