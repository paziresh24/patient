import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import ErrorPage from '@/modules/profile/components/errorPage';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const NotFound = () => {
  const router = useRouter();

  return <ErrorPage statusCode={404} refresh={() => router.reload()} />;
};

NotFound.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter showSearchSuggestionButton>{page}</LayoutWithHeaderAndFooter>;
};

export default NotFound;
