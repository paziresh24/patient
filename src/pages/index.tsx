import { useLoginModalContext } from '@/modules/login/context/loginModal';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  const { openLoginModal } = useLoginModalContext();
  return (
    <div>
      <Head>
        <title>Patient</title>
      </Head>

      <main>*</main>
      <button
        onClick={() =>
          openLoginModal({
            state: true,
            postLogin() {
              console.log('test');
            },
          })
        }
      >
        login
      </button>
    </div>
  );
};

export default Home;
