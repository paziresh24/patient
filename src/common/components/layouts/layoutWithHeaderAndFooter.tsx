import useCustomize from '@/common/hooks/useCustomize';
import { ReactNode } from 'react';
import BottomNavigation from './bottomNavigation';
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
  const customize = useCustomize(state => state.customize);

  return (
    <div className="pb-16 md:pb-0">
      {customize.showHeader && (
        <Header shouldShowBrand={customize.showBrandLogoInHomePage || shouldShowBrand} shouldShowPromoteApp={shouldShowPromoteApp} />
      )}
      {children}
      {customize.showFooter && (customize.footerType === 'compact' ? <CompactFooter /> : <Footer />)}
      <BottomNavigation />
    </div>
  );
};
