import { UserInfo } from '@/modules/login/store/userInfo';

const ONLINE_VISIT_CENTER_ID = '5532';

export const getDoctorSlug = (user?: UserInfo) => user?.provider?.slug;

export const getOnlineVisitCenter = (user?: UserInfo) =>
  user?.provider?.centers?.find((center: { id?: string }) => center.id === ONLINE_VISIT_CENTER_ID);

export const getClinicCenters = (user?: UserInfo) =>
  user?.provider?.centers?.filter((center: { id?: string }) => center.id !== ONLINE_VISIT_CENTER_ID) ?? [];

export const hasOnlineVisitCenter = (user?: UserInfo) => !!getOnlineVisitCenter(user);
