import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Footer from './footer';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({ children }: { children: ReactElement }) => {
  const { query } = useRouter();

  return (
    <>
      {!query.isWebView && <Header />}
      {children}
      {!query.isWebView && <Footer />}
    </>
  );
};
