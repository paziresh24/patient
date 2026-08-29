export const doctorSlugFromSearchHit = (doctor?: { slug?: string; url?: string } | null): string | undefined => {
  const raw = doctor?.slug || doctor?.url;
  if (!raw || typeof raw !== 'string') return undefined;
  const slug = raw.split('/').filter(Boolean).pop();
  return slug || undefined;
};
