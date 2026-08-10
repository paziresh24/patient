import { isPicUserImageUrl, picUserImageUrl } from '@/common/utils/picUserImageUrl';

const NO_DOCTOR_PROFILE_IMAGE = 'https://cdn.paziresh24.com/getImage/p24/search-men/noimage.png';

/** Full-size URL for Open Graph / JSON-LD. */
export function resolveDoctorProfileImageUrl(
  information: { user_id?: string | null; image?: string | null } | undefined,
  pageUserId?: string | null,
) {
  const userId = information?.user_id ?? pageUserId;
  if (userId) {
    return `https://pic.paziresh24.com/api/image/${userId}`;
  }
  const image = typeof information?.image === 'string' ? information.image.trim() : '';
  if (image) {
    if (/^https?:\/\//i.test(image)) return image;
    return `https://www.paziresh24.com${image.startsWith('/') ? '' : '/'}${image}`;
  }
  return NO_DOCTOR_PROFILE_IMAGE;
}

/** Smaller pic CDN variant for above-the-fold avatar (LCP). */
export function resolveDoctorProfileLcpImageUrl(
  information: { user_id?: string | null; image?: string | null } | undefined,
  pageUserId?: string | null,
) {
  const userId = information?.user_id ?? pageUserId;
  if (userId) {
    return picUserImageUrl(userId);
  }
  return resolveDoctorProfileImageUrl(information, pageUserId);
}

export { isPicUserImageUrl, NO_DOCTOR_PROFILE_IMAGE };
