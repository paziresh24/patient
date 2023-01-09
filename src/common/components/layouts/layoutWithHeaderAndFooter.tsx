import useCustomize from '@/common/hooks/useCustomize';
import useWebView from '@/common/hooks/useWebView';
import { ReactNode } from 'react';
import Footer from './footer';
import CompactFooter from './footer/compactFooter';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({
  children,
  shouldShowBrand = true,
  shouldShowPromoteApp = true,
}: {
  children: ReactNode;
  shouldShowBrand?: boolean;
  shouldShowPromoteApp?: boolean;
}) => {
  const isWebView = useWebView();
  const customize = useCustomize(state => state.customize);

  return (
    <>
      {!isWebView && (
        <Header shouldShowBrand={customize.showBrandLogoInHomePage || shouldShowBrand} shouldShowPromoteApp={shouldShowPromoteApp} />
      )}
      {children}
      {!isWebView && (customize.footerType === 'compact' ? <CompactFooter /> : <Footer />)}
    </>
  );
};
