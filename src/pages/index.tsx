import Logo from '@/common/components/atom/logo';
import Footer from '@/common/components/layouts/footer';
import Header from '@/common/components/layouts/header';
import Promote from '@/modules/home/components/promote';
import RecentSearch from '@/modules/search/view/recentSearch';
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
      <main className="h-[91vh] flex flex-col justify-center items-center p-5 pb-40 space-y-8">
        <Logo className="text-2xl md:text-3xl" />
        <Suggestion />
        <RecentSearch />
      </main>

      <Promote />
      <Footer />
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
