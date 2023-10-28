import { withCSR } from '@/common/hoc/withCsr';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import ForgotForm from '@/modules/login/views/forgotForm';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

const ForgotPage = () => {
  const router = useRouter();
  const { handleOpenLoginModal } = useLoginModalContext();

  useEffect(() => {
    handleOpenLoginModal({
      state: false,
    });
    if (!router.query?.mobile_number) {
      router.replace('/login');
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen p-8 bg-white">
      <div className="w-96">
        <ForgotForm mobileNumber={router.query.mobile_number as string} postLogin={() => router.push('/')} />
      </div>
    </div>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default ForgotPage;
