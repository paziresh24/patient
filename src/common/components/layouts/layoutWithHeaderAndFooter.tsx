import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Footer from './footer';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({ children, shouldShowBrand = true }: { children: ReactElement; shouldShowBrand?: boolean }) => {
  const { query } = useRouter();

  return (
    <>
      {!query.isWebView && <Header shouldShowBrand={shouldShowBrand} />}
      {children}
      {!query.isWebView && <Footer />}
    </>
  );
};
