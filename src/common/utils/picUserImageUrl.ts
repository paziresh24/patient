const PIC_USER_IMAGE_BASE = 'https://pic.paziresh24.com/api/image';

export const picUserImageUrl = (userId: string | number): string =>
  `${PIC_USER_IMAGE_BASE}/${userId}?p=thumb`;

export const PIC_USER_IMAGE_FALLBACK_URL = picUserImageUrl(1);

export const isPicUserImageUrl = (src?: string | null): src is string =>
  typeof src === 'string' && src.includes(`${PIC_USER_IMAGE_BASE}/`);
