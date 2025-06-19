import Loading from '@/common/components/atom/loading';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import LoginForm from '@/modules/login/views/loginForm';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

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
  const isLoading = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);

  const isUrlValid = isValidHttpUrl(router.query?.redirect_url as string)
    ? new URL(router.query?.redirect_url as string).hostname.includes('paziresh24.com')
    : (router.query?.redirect_url as string)?.startsWith('/');

  const redirectAction = () => {
    router.push(isUrlValid ? decodeURI(decodeURIComponent(router.query?.redirect_url as string)) : '/');
  };

  useEffect(() => {
    if (typeof router.query?.token === 'string') {
      setCookie('token', decodeURIComponent(router.query?.token as string), {
        path: '/',
        maxAge: dayToSecond(365),
      });
      redirectAction();
    }
  }, [router.query]);

  useEffect(() => {
    if (!isLoading && isLogin) {
      redirectAction();
    }
  }, [isLogin, isLoading]);

  return (
    <div className="flex items-center justify-center h-screen p-8 bg-white">
      {(isLoading || isLogin) && <Loading />}
      {!isLoading && !isLogin && (
        <div className="w-96">
          <LoginForm postLogin={() => redirectAction()} />
        </div>
      )}
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
