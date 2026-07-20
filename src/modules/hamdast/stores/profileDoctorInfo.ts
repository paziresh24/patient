export type ProfileDoctorInfo = {
  userId: string;
  displayName: string;
  imageUrl?: string | null;
  slug?: string | null;
};

let profileDoctorInfo: ProfileDoctorInfo | null = null;
let profileWidgetName: string | null = null;
/** Bumps on every set so stale cleanups from a previous profile don't wipe newer data. */
let profileDoctorEpoch = 0;

type WindowDoctor = {
  user_id?: string | number | null;
  display_name?: string | null;
  name?: string | null;
  family?: string | null;
  image?: string | null;
  slug?: string | null;
};

function readWindowDoctor(): ProfileDoctorInfo | null {
  if (typeof window === 'undefined') return null;
  const doctor = (window as Window & { doctor?: WindowDoctor }).doctor;
  if (!doctor?.user_id) return null;

  const displayName =
    doctor.display_name?.trim() ||
    [doctor.name, doctor.family].filter(Boolean).join(' ').trim() ||
    '';

  return {
    userId: String(doctor.user_id).trim(),
    displayName,
    imageUrl: doctor.image ?? `https://pic.paziresh24.com/api/image/${doctor.user_id}`,
    slug: doctor.slug ?? null,
  };
}

export function setProfileDoctorInfo(info: ProfileDoctorInfo): number {
  const userId = String(info.userId ?? '').trim();
  if (!userId) return profileDoctorEpoch;

  profileDoctorEpoch += 1;
  profileDoctorInfo = {
    userId,
    displayName: (info.displayName ?? '').trim(),
    imageUrl: info.imageUrl ?? null,
    slug: info.slug ?? null,
  };
  return profileDoctorEpoch;
}

/** Update display fields without bumping epoch (won't break unmount cleanup). */
export function updateProfileDoctorInfo(
  partial: Partial<Pick<ProfileDoctorInfo, 'displayName' | 'imageUrl' | 'slug'>>,
) {
  if (!profileDoctorInfo?.userId) return;
  profileDoctorInfo = {
    ...profileDoctorInfo,
    ...(partial.displayName !== undefined
      ? { displayName: (partial.displayName ?? '').trim() }
      : {}),
    ...(partial.imageUrl !== undefined ? { imageUrl: partial.imageUrl } : {}),
    ...(partial.slug !== undefined ? { slug: partial.slug } : {}),
  };
}

export function getProfileDoctorInfo(): ProfileDoctorInfo | null {
  if (profileDoctorInfo?.userId) return profileDoctorInfo;
  return readWindowDoctor();
}

/**
 * Clear cached profile doctor info.
 * Pass the epoch returned by `setProfileDoctorInfo` so a previous page's
 * unmount cannot clear a newer profile that already replaced it.
 */
export function clearProfileDoctorInfo(epoch?: number) {
  if (epoch !== undefined && epoch !== profileDoctorEpoch) return;
  profileDoctorInfo = null;
}

export function setProfileDoctorUserId(id: string | null) {
  if (!id) {
    profileDoctorInfo = null;
    return;
  }
  setProfileDoctorInfo({
    userId: id,
    displayName: profileDoctorInfo?.displayName ?? '',
    imageUrl: profileDoctorInfo?.imageUrl,
    slug: profileDoctorInfo?.slug,
  });
}

export function getProfileDoctorUserId(): string | null {
  return getProfileDoctorInfo()?.userId ?? null;
}

/** Resolve provider (doctor) user id from payment event + profile context. */
export function resolveProviderUserId(eventData?: {
  doctor_user_id?: string | number | null;
  provider_user_id?: string | number | null;
} | null): string {
  const fromEvent =
    eventData?.doctor_user_id ?? eventData?.provider_user_id ?? null;
  if (fromEvent != null && String(fromEvent).trim()) {
    return String(fromEvent).trim();
  }
  return getProfileDoctorUserId() ?? '';
}

export function setProfileWidgetName(name: string | null) {
  profileWidgetName = name?.trim() || null;
}

export function getProfileWidgetName(): string | null {
  return profileWidgetName;
}

export function clearProfileWidgetName() {
  profileWidgetName = null;
}
