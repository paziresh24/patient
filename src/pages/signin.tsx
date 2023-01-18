import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import LoginForm from '@/modules/login/views/loginForm';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

const LoginPage = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen p-8 bg-white">
      <div className="w-96">
        <LoginForm postLogin={() => router.push('/')} />
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter {...page.props.config}>{page}</LayoutWithHeaderAndFooter>;
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default LoginPage;
