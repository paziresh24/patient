import useCustomize from '@/common/hooks/useCustomize';
import useWebView from '@/common/hooks/useWebView';
import clsx from 'clsx';
import { ReactNode } from 'react';
import BottomNavigation from './bottomNavigation';
import Footer from './footer';
import CompactFooter from './footer/compactFooter';
import Header from './header';

export const LayoutWithHeaderAndFooter = ({
  children,
  shouldShowBrand = true,
  shouldShowPromoteApp = true,
  showBottomNavigation = true,
  showHeader = true,
  showFooter = true,
}: {
  children: ReactNode;
  shouldShowBrand?: boolean;
  shouldShowPromoteApp?: boolean;
  showBottomNavigation?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}) => {
  const customize = useCustomize(state => state.customize);
  const isWebView = useWebView();

  return (
    <div className={clsx({ 'pb-16 md:pb-0': showBottomNavigation })}>
      {customize.showHeader && showHeader && (
        <Header shouldShowBrand={customize.showBrandLogoInHomePage || shouldShowBrand} shouldShowPromoteApp={shouldShowPromoteApp} />
      )}
      {children}
      {customize.showFooter && showFooter && (customize.footerType === 'compact' ? <CompactFooter /> : <Footer />)}
      {showBottomNavigation && !isWebView && <BottomNavigation />}
    </div>
  );
};
