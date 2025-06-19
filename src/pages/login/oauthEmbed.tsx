import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

const OauthEmbed = () => {
  const router = useRouter();
  const info = useUserInfoStore(state => state.info);

  useEffect(() => {
    const code = router.query?.code as string;
    if (code) {
      setCookie('gozargah_logged_in_user_id', info?.id, {
        maxAge: 60 * 10,
      });
    }
  }, [router.query, info]);

  return null;
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

export default OauthEmbed;
