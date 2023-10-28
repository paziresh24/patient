import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { BookmarksList } from '@/modules/patient/views/bookmarksList';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

export const Bookmarks = () => {
  const { query } = useRouter();
  const { t } = useTranslation('patient/bookmarks');

  return (
    <>
      <Seo title={t('title')} noIndex />

      <AppBar title={t('title')} className="hidden pwa:!flex" backButton={query.referrer === 'profile'} />

      <div className="flex flex-col p-5 bg-white rounded-md">
        <Text fontWeight="black" fontSize="xl" className="pwa:hidden mb-5">
          {t('title')}
        </Text>
        <BookmarksList />
      </div>
    </>
  );
};

Bookmarks.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config}>
      <PatientProfileLayout>{page}</PatientProfileLayout>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Bookmarks;
