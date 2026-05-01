import { drProfileClient, searchClient } from '@/common/apis/client';

const extractSearchItems = (response: any): any[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.result)) return response.result;
  if (Array.isArray(response?.search?.result)) return response.search.result;
  if (Array.isArray(response?.data?.result)) return response.data.result;
  if (Array.isArray(response?.data?.search?.result)) return response.data.search.result;
  return [];
};

const extractSlugFromUrl = (url?: string) => {
  if (!url) return undefined;
  const cleanUrl = url.split('?')[0];
  const parts = cleanUrl.split('/').filter(Boolean);
  const drIndex = parts.findIndex(item => item === 'dr');
  if (drIndex === -1 || !parts[drIndex + 1]) return undefined;
  return parts[drIndex + 1];
};

const isDoctorMatch = (item: any, doctorId: string, slug?: string) => {
  const directId = item?.id != null ? String(item.id) : '';
  const nestedId = item?.doctor_id != null ? String(item.doctor_id) : '';
  const itemSlug = item?.slug || item?.doctor_slug || extractSlugFromUrl(item?.url);
  return directId === doctorId || nestedId === doctorId || (Boolean(slug) && itemSlug === slug);
};

export const getDoctorByDoctorId = async (doctorId: string) => {
  const normalizedDoctorId = String(doctorId || '').trim();
  if (!normalizedDoctorId) return null;

  const { data: doctorInfo } = await drProfileClient.get(`/api/doctors/${encodeURIComponent(normalizedDoctorId)}/1/`);
  const resolvedSlug = doctorInfo?.slug ? String(doctorInfo.slug) : undefined;

  if (!resolvedSlug) return null;

  const apiAttempts = [
    { text: resolvedSlug, limit: 20, page: 1 },
    { doctor_id: normalizedDoctorId, limit: 20, page: 1 },
  ];

  for (const params of apiAttempts) {
    const { data } = await searchClient.get('/seapi/v1/search/ir/doctor', { params });
    const items = extractSearchItems(data);
    const matchedItem = items.find(item => isDoctorMatch(item, normalizedDoctorId, resolvedSlug));
    if (!matchedItem) continue;

    return {
      ...matchedItem,
      doctor_id: matchedItem?.doctor_id ?? normalizedDoctorId,
      user_id: matchedItem?.user_id ?? doctorInfo?.user_id,
      slug: matchedItem?.slug || matchedItem?.doctor_slug || resolvedSlug,
      url: matchedItem?.url || `/dr/${resolvedSlug}`,
    };
  }

  return {
    id: doctorInfo?.owner_id ?? doctorInfo?.id ?? normalizedDoctorId,
    doctor_id: normalizedDoctorId,
    user_id: doctorInfo?.user_id,
    slug: resolvedSlug,
    url: `/dr/${resolvedSlug}`,
    title: String(resolvedSlug).replace(/-/g, ' '),
  };
};
