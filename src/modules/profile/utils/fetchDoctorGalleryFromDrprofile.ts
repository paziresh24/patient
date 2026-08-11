import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { getDoctorGallery } from '@/common/apis/services/doctor/getDoctorGallery';

/**
 * Clinic gallery lives on drprofile (`/api/centers/{id}/gallery`).
 * profiles-api may return `/storage/gallery/...` paths that are not served on CDN yet.
 */
export async function fetchDoctorGalleryFromDrprofile(slug: string, university?: string) {
  const centers = await getDoctorCenters(slug, university, { onlyBookable: false });
  if (!centers?.length) return [];

  const results = await Promise.allSettled(centers.map(center => getDoctorGallery(center.id)));

  return results
    .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof getDoctorGallery>>> => result.status === 'fulfilled')
    .flatMap(result => result.value)
    .filter(item => typeof item?.image === 'string' && item.image.trim())
    .map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
    }));
}
