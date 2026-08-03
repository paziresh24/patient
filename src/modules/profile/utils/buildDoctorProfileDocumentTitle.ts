/** Build doctor profile document title without leaking `undefined` into SEO. */
export function buildDoctorProfileDocumentTitle({
  displayName,
  expertiseTitle,
  doctorCitiesLabel,
}: {
  displayName?: string | null;
  expertiseTitle?: string | null;
  doctorCitiesLabel?: string | null;
}): string {
  const name = (displayName ?? '').trim();
  const expertise = (expertiseTitle ?? '').trim();
  const cities = (doctorCitiesLabel ?? '').trim();
  const suffix = 'نوبت دهی آنلاین و شماره تلفن';
  const detail = [expertise, cities].filter(Boolean).join(' ');
  const tail = detail ? `${detail} ${suffix}` : suffix;
  return [name, tail].filter(Boolean).join('، ');
}
