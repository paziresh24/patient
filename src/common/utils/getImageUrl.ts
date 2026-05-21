const ABSOLUTE_URL_REGEX = /^(?:https?:)?\/\//i;

export const getImageUrl = (imagePath?: string, cdnBaseUrl: string = '') => {
  if (!imagePath) return '';

  const normalizedImagePath = imagePath.trim();
  if (!normalizedImagePath) return '';

  // If API already returns an absolute URL, keep it unchanged.
  if (ABSOLUTE_URL_REGEX.test(normalizedImagePath)) return normalizedImagePath;

  if (!cdnBaseUrl) return normalizedImagePath;

  const normalizedCdnBase = cdnBaseUrl.replace(/\/+$/, '');
  const normalizedRelativePath = normalizedImagePath.replace(/^\/+/, '');

  return `${normalizedCdnBase}/${normalizedRelativePath}`;
};
