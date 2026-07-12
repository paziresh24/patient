import Loading from '@/common/components/atom/loading';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { resolveSafeRedirectUrl } from '@/common/utils/safeRedirectUrl';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import LoginForm from '@/modules/login/views/loginForm';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const isLoading = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);

  const safeRedirectUrl =
    typeof window !== 'undefined'
      ? resolveSafeRedirectUrl(router.query?.redirect_url as string | undefined, window.location.origin)
      : '/';

  const redirectAction = () => {
    router.push(safeRedirectUrl);
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
