const MEDICAL_CODE_LABEL = 'کدنظام پزشکی';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const formatCouncilMedicalCodeLine = (code: string): string => `${MEDICAL_CODE_LABEL}: ${code.trim()}`;

export const resolveCouncilMedicalCode = (...candidates: Array<string | number | null | undefined>): string => {
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return String(candidate);
    }
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return '';
};

/** Removes «کدنظام پزشکی» lines from biography HTML so they are not shown as editable copy. */
export const stripCouncilMedicalCodeFromBiography = (biography: string | null | undefined): string => {
  if (typeof biography !== 'string' || !biography) {
    return '';
  }

  return biography.replace(/<p>\s*کدنظام پزشکی:\s*[^<]*<\/p>/gi, '').trim();
};

/** Prepends «کدنظام پزشکی: …» to about-me HTML without mutating SEO biography. */
export const buildAboutBiographyWithMedicalCode = (
  biography: string | null | undefined,
  medicalCode: string | null | undefined,
): string => {
  const code = resolveCouncilMedicalCode(medicalCode);
  const bio = stripCouncilMedicalCodeFromBiography(biography);
  if (!code) {
    return bio;
  }

  const line = formatCouncilMedicalCodeLine(code);
  const paragraph = `<p>${escapeHtml(line)}</p>`;
  return bio ? `${paragraph}${bio}` : paragraph;
};
