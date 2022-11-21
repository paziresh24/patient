import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({ children, shouldShowBrand = true }: { children: ReactNode; shouldShowBrand?: boolean }) => {
  const { query } = useRouter();

  return (
    <>
      {!query.isWebView && <Header shouldShowBrand={shouldShowBrand} />}
      {children}
      {!query.isWebView && <Footer />}
    </>
  );
};
