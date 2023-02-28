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
  showSearchSuggestionButton = false,
}: {
  children: ReactNode;
  shouldShowBrand?: boolean;
  shouldShowPromoteApp?: boolean;
  showBottomNavigation?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showSearchSuggestionButton?: boolean;
}) => {
  const customize = useCustomize(state => state.customize);
  const isWebView = useWebView();

  return (
    <div className={clsx({ 'pb-16 md:pb-0': showBottomNavigation })}>
      {customize.showHeader && showHeader && (
        <Header
          showSearchSuggestionButton={showSearchSuggestionButton}
          shouldShowBrand={customize.showBrandLogoInHomePage || shouldShowBrand}
          shouldShowPromoteApp={shouldShowPromoteApp}
        />
      )}
      <div style={{ minHeight: 'calc(100vh - 8.8125rem)' }}>{children}</div>
      {customize.showFooter && showFooter && (customize.footerType === 'compact' ? <CompactFooter /> : <Footer />)}
      {showBottomNavigation && !isWebView && <BottomNavigation />}
    </div>
  );
};
