import { searchClient } from '@/common/apis/client';

type GetDoctorKeywordTagsParams = {
  slug: string;
  searchText?: string;
  cityEnSlug?: string;
};

const buildSearchTextFromSlug = (slug: string) =>
  slug
    .replace(/^دکتر-/, '')
    .replace(/-\d+$/, '')
    .replace(/-/g, ' ')
    .trim();

/**
 * Keyword tags shown under specialty on search cards (`keyword_tags_user_priority_1`).
 * Soft-fails to [] so profile never breaks if search is down.
 */
export const getDoctorKeywordTags = async ({
  slug,
  searchText,
  cityEnSlug = 'ir',
}: GetDoctorKeywordTagsParams): Promise<string[]> => {
  const text = searchText?.trim() || buildSearchTextFromSlug(slug);
  if (!text) return [];

  const normalizedSlug = decodeURIComponent(slug);
  const cities = Array.from(new Set([cityEnSlug || 'ir', 'ir'].filter(Boolean)));

  for (const city of cities) {
    try {
      const { data } = await searchClient.get(`/seapi/v1/search/${encodeURIComponent(city)}`, {
        params: { text },
        timeout: 2500,
      });

      const results = data?.search?.result;
      if (!Array.isArray(results) || results.length === 0) continue;

      const match = results.find((item: any) => {
        const url = String(item?.url ?? '');
        const itemSlug = String(item?.slug ?? '');
        return (
          itemSlug === normalizedSlug ||
          url === `/dr/${normalizedSlug}/` ||
          url === `/dr/${normalizedSlug}` ||
          url.includes(`/dr/${normalizedSlug}`)
        );
      });

      const tags = match?.keyword_tags_user_priority_1;
      if (!Array.isArray(tags) || tags.length === 0) continue;

      return tags.map((tag: unknown) => String(tag ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    } catch (error) {
      console.error('Error fetching doctor keyword tags from search:', error);
    }
  }

  return [];
};
