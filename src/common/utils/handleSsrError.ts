import { QueryClient, dehydrate } from '@tanstack/react-query';
import { sanitizeObject } from './sanitizeObject';

export const handleSsrError = (
  statusCode: number,
  slug: string,
  extras?: { message?: string; noIndex?: boolean; profile_backend?: string },
): { props: any } => {
  const errorProps = {
    centers: [],
    information: null,
    expertises: {},
    feedbacks: {},
    media: {},
    symptomes: {},
    history: {},
    onlineVisit: {},
    similarLinks: [],
    fragmentComponents: {},
    breadcrumbs: [],
    hamdastWidgets: [],
    hamdastWidgetsData: {},
    user_id: null,
    title: extras?.message ? 'اطلاعات پزشک در حال به‌روزرسانی است' : `خطا در بارگذاری صفحه`,
    description: '',
    slug,
    status: statusCode,
    errorMessage: extras?.message ?? null,
    noIndex: extras?.noIndex ?? [500, 502, 503, 504].includes(statusCode),
    profile_backend: extras?.profile_backend ?? null,
    dehydratedState: dehydrate(new QueryClient()),
  };

  return {
    props: sanitizeObject(errorProps),
  };
};
