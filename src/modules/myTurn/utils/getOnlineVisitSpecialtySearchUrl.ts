export const getOnlineVisitSpecialtySearchUrl = ({
  expertiseGroupSlug,
  expertiseSlug,
  citySlug = 'ir',
}: {
  expertiseGroupSlug?: string;
  expertiseSlug?: string;
  citySlug?: string;
}) => {
  const category = expertiseGroupSlug?.trim();
  const pathname = category ? `/s/${citySlug}/${category}` : `/s/${citySlug}`;
  const query: Record<string, string> = { turn_type: 'consult' };

  if (expertiseSlug) {
    query.sub_category = expertiseSlug.startsWith('exp-') ? expertiseSlug : `exp-${expertiseSlug}`;
  }

  const search = new URLSearchParams(query).toString();
  return `${pathname}?${search}`;
};
