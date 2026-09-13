export type DoctorIdentityUser = {
  is_doctor?: boolean;
  provider?: {
    job_title?: string | null;
    centers?: unknown[];
  };
};

export const isDoctorUser = (user?: DoctorIdentityUser | null) => {
  const centers = user?.provider?.centers;
  return Array.isArray(centers) && centers.length > 0;
};

/** Nav/chrome: centers, sticky device cache, or fields that survive until centers sync. */
export const hasDoctorIdentity = (user?: DoctorIdentityUser | null, deviceCached = false) => {
  if (deviceCached) return true;
  if (!user) return false;
  return isDoctorUser(user) || user.is_doctor === true || user.provider?.job_title === 'doctor';
};

export const doctorJobTitleAttr = (user?: DoctorIdentityUser | null, deviceCached = false) =>
  hasDoctorIdentity(user, deviceCached) ? 'doctor' : 'normal';
