import ErrorIcon from '@/common/components/icons/error';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Head from 'next/head';

const Fallback = () => (
  <LayoutWithHeaderAndFooter>
    <Head>
      <title>پذیرش24 | اینترنت خود را بررسی کنید</title>
    </Head>
    <div className="flex bg-white flex-col space-y-1 justify-center items-center flex-grow">
      <ErrorIcon className="mb-3" />
      <h1 className="font-bold text-lg">شما در حال حاضر آفلاین هستید!</h1>
      <span className="text-sm">لطفا اینترنت خود را بررسی کنید.</span>
    </div>
  </LayoutWithHeaderAndFooter>
);

export default Fallback;
