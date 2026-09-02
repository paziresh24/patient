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

/** Drop `?p=thumb` so lightbox loads the full-resolution pic CDN image. */
export function toDoctorProfileLightboxSrc(src: string): string {
  if (!src || !isPicUserImageUrl(src)) return src;
  try {
    const url = new URL(src);
    if (url.searchParams.get('p') === 'thumb') {
      url.searchParams.delete('p');
    }
    const out = url.toString();
    return out.endsWith('?') ? out.slice(0, -1) : out;
  } catch {
    return src.replace(/\?p=thumb$/, '').replace(/([?&])p=thumb(&|$)/, (_, sep, end) => (end === '&' ? sep : ''));
  }
}

export function canPreviewDoctorProfileImage(src?: string | null): boolean {
  if (!src?.trim()) return false;
  if (src === NO_DOCTOR_PROFILE_IMAGE) return false;
  if (/noimage/i.test(src)) return false;
  return true;
}

export { isPicUserImageUrl, NO_DOCTOR_PROFILE_IMAGE };
