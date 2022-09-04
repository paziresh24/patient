import Footer from '@/common/components/layouts/footer';
import Header from '@/common/components/layouts/header';
import Promote from '@/modules/home/components/promote';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Patient</title>
      </Head>
      <Header />
      <main>*</main>

      <Promote />
      <Footer />
    </div>
  );
};

export default Home;
