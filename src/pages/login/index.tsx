import Loading from '@/common/components/atom/loading';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import LoginForm from '@/modules/login/views/loginForm';
import { getCookie, setCookie } from 'cookies-next';
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

function isAllowedRedirectHost(hostname: string) {
  return hostname.includes('paziresh24.com') || hostname.endsWith('p24cloud.ir');
}

function resolveRedirectTarget(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw) return null;

  const decoded = decodeURI(decodeURIComponent(raw));
  if (isValidHttpUrl(decoded)) {
    try {
      const url = new URL(decoded);
      return isAllowedRedirectHost(url.hostname) ? decoded : null;
    } catch {
      return null;
    }
  }

  return decoded.startsWith('/') ? decoded : null;
}

const LoginPage = () => {
  const router = useRouter();
  const isLoading = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);

  const redirectAction = () => {
    const target = resolveRedirectTarget(router.query?.redirect_url);
    if (!target) {
      router.push('/');
      return;
    }

    // Absolute URLs (incl. p24cloud survey host) need a full navigation.
    if (target.startsWith('http://') || target.startsWith('https://')) {
      try {
        const url = new URL(target);
        // Cross-site hosts cannot read *.paziresh24.com cookies; pass token once.
        if (url.hostname.endsWith('p24cloud.ir')) {
          const token = getCookie('token');
          if (typeof token === 'string' && token) {
            url.searchParams.set('token', token);
          }
        }
        window.location.assign(url.toString());
      } catch {
        window.location.assign(target);
      }
      return;
    }

    router.push(target);
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
