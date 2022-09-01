import Logo from '@/common/components/atom/logo';
import Footer from '@/common/components/layouts/footer';
import Header from '@/common/components/layouts/header';
import Suggestion from '@/modules/search/view/suggestion';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Patient</title>
      </Head>
      <Header />
      <main className="h-screen flex flex-col justify-center items-center p-5 pb-52 space-y-8">
        <Logo fontSize="2xl" />
        <Suggestion />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
