import Logo from '@/common/components/atom/logo';
import Footer from '@/common/components/layouts/footer';
import Header from '@/common/components/layouts/header';
import Promote from '@/modules/home/components/promote';
import RecentSearch from '@/modules/search/view/recentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

const Home: NextPage = () => {
  return (
    <div>
      <NextSeo title="نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان" canonical="https://www.paziresh24.com/" />
      <Header shouldShowBrand={false} />
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
