import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import LoginForm from '@/modules/login/views/loginForm';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

function isValidHttpUrl(string: string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

const LoginPage = () => {
  const router = useRouter();

  const isUrlValid = isValidHttpUrl(router.query?.redirect_url as string)
    ? new URL(router.query?.redirect_url as string).hostname.includes('paziresh24.com')
    : (router.query?.redirect_url as string).startsWith('/');

  return (
    <div className="flex items-center justify-center h-screen p-8 bg-white">
      <div className="w-96">
        <LoginForm postLogin={() => router.push(isUrlValid ? decodeURI(decodeURIComponent(router.query?.redirect_url as string)) : '/')} />
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
