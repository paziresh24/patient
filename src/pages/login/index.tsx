import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import LoginForm from '@/modules/login/views/loginForm';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen p-8 bg-white">
      <div className="w-96">
        <LoginForm
          postLogin={() =>
            router.push(router.query?.redirect_url ? decodeURI(decodeURIComponent(router.query?.redirect_url as string)) : '/')
          }
        />
      </div>
    </div>
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

export default LoginPage;
