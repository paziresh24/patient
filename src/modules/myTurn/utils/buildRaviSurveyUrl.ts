const DEFAULT_RAVI_FRONT_BASE_URL = 'https://ravi-front-ravi.p24cloud.ir';

interface BuildRaviSurveyUrlParams {
  userId: string | number;
  bookId: string | number;
  doctorSlug?: string;
  centerId?: string | number;
  doctorId?: string | number;
  serverId?: string | number;
}

export const buildRaviSurveyUrl = ({
  userId,
  bookId,
  doctorSlug,
  centerId,
  doctorId,
  serverId,
}: BuildRaviSurveyUrlParams) => {
  const normalizedCenterId = String(centerId ?? '').trim();
  const baseUrl = (process.env.NEXT_PUBLIC_RAVI_FRONT_BASE_URL || DEFAULT_RAVI_FRONT_BASE_URL).replace(/\/$/, '');
  const surveyPath = normalizedCenterId === '5532' ? '/ravi/v2/survay/online-visit' : '/ravi/v2/survay/office';
  const params = new URLSearchParams({
    user_id: String(userId),
    book_id: String(bookId),
  });

  if (serverId != null && String(serverId).trim()) params.set('server_id', String(serverId).trim());
  if (doctorSlug) params.set('doctor_slug', doctorSlug);
  if (normalizedCenterId) params.set('center_id', normalizedCenterId);
  if (doctorId != null && String(doctorId)) params.set('doctor_id', String(doctorId));

  return `${baseUrl}${surveyPath}?${params.toString()}`;
};
