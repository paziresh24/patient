import useWebView from '@/common/hooks/useWebView';
import { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({ children, shouldShowBrand = true }: { children: ReactNode; shouldShowBrand?: boolean }) => {
  const isWebView = useWebView();

  return (
    <>
      {!isWebView && <Header shouldShowBrand={shouldShowBrand} />}
      {children}
      {!isWebView && <Footer />}
    </>
  );
};
