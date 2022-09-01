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
      <main className="h-screen flex flex-col justify-center items-center p-5 pb-20">
        <Suggestion />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
