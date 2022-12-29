import useCustomize from '@/common/hooks/useCustomize';
import useWebView from '@/common/hooks/useWebView';
import { ReactNode } from 'react';
import Footer from './footer';
import CompactFooter from './footer/compactFooter';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({ children, shouldShowBrand = true }: { children: ReactNode; shouldShowBrand?: boolean }) => {
  const isWebView = useWebView();
  const customize = useCustomize();

  return (
    <>
      {!isWebView && <Header shouldShowBrand={shouldShowBrand} />}
      {children}
      {!isWebView && (customize.footerType === 'compact' ? <CompactFooter /> : <Footer />)}
    </>
  );
};
