import { QueryClient, dehydrate } from '@tanstack/react-query';
import { sanitizeObject } from './sanitizeObject';

export const handleSsrError = (statusCode: number, slug: string): { props: any } => {
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
    title: `خطا در بارگذاری صفحه`,
    description: '',
    slug,
    status: statusCode,
    dehydratedState: dehydrate(new QueryClient()),
  };

  return {
    props: sanitizeObject(errorProps),
  };
};
